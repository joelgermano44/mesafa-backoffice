import { Service, signal, Signal, WritableSignal } from '@angular/core';
import * as CryptoJS from 'crypto-js';

type TratadorDeErro = (mensagem: string, erro?: unknown) => void;

/**
 * Serviço genérico de leitura/escrita cifrada (AES) em localStorage.
 * Também expõe a chave como um `Signal` reactivo (`sinalTexto`/`sinalDados`): actualiza-se sozinho
 * ao gravar/remover aqui e ao mudar noutra tab (evento `storage`) — sem o consumidor ter de ligar nada.
 */
@Service()
export class AencriptJdecriptDToken {
  /** Assinatura obrigatoria para o funcionamento — participa na derivação da chave mestra; não remover nem alterar. */
  private static readonly ASSINATURA = '$_dom@Jam_Adri3D';
  private static readonly CHAVE_MESTRA = CryptoJS.SHA256(AencriptJdecriptDToken.ASSINATURA).toString().slice(0, 24);
  private static readonly INDICE = '__ajd_idx';

  private encryptionKey: string | null = null;
  private aoErrar: TratadorDeErro = (msg, err) => console.error(msg, err);

  private readonly sinaisTexto = new Map<string, WritableSignal<string | null>>();
  private readonly sinaisObjecto = new Map<string, { sinal: WritableSignal<unknown>; versao: number }>();
  private ouvinteTabLigado = false;

  private isBrowser(): boolean {
    return typeof localStorage !== 'undefined';
  }

  /** Substitui o tratamento de erros por omissão (`console.error`) por um handler à escolha do projecto. */
  public definirTratadorDeErro(handler: TratadorDeErro): void {
    this.aoErrar = handler;
  }

  public hasSecureItem(key: string): boolean {
    return this.isBrowser() && localStorage.getItem(key) !== null;
  }

  public setSecureItem(key: string, value: string): void {
    if (!value || !this.isBrowser()) return;

    try {
      localStorage.setItem(key, CryptoJS.AES.encrypt(value, this.obterOuCriarChave()).toString());
      this.registarChave(key);
      this.actualizarSinais(key);
    } catch (error) {
      this.aoErrar('Erro ao encriptar os dados:', error);
    }
  }

  public getSecureItem(key: string): string | null {
    if (!this.isBrowser()) return null;

    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) return null;

    try {
      const decryptedText = CryptoJS.AES.decrypt(encryptedData, this.obterOuCriarChave()).toString(CryptoJS.enc.Utf8);
      // Se a decifragem falhar ou retornar string vazia, limpa o registo corrompido
      if (!decryptedText) {
        this.removeSecureItem(key);
        return null;
      }
      return decryptedText;
    } catch {
      this.removeSecureItem(key);
      return null;
    }
  }

  public removeSecureItem(key: string): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(key);
    this.desregistarChave(key);
    this.actualizarSinais(key);
  }

  /**
   * Lê e desserializa um objecto previamente guardado com `guardarDadosSegurosNoStorage`.
   * `versao` deve corresponder à forma actual de T; um envelope de outra versão é descartado
   * (e avisado, para distinguir de "nunca gravado") em vez de ser confiado às cegas.
   */
  public buscarDadosSegurosDoStorage<T>(key: string, versao = 1): T | null {
    const raw = this.getSecureItem(key);
    if (!raw) return null;

    try {
      const envelope = JSON.parse(raw) as { v?: number; dados?: T };
      if (envelope?.v !== versao) {
        if (envelope) this.aoErrar(`"${key}": versão ${envelope.v} encontrada, esperava-se ${versao}. A descartar.`);
        this.removeSecureItem(key);
        return null;
      }
      return envelope.dados ?? null;
    } catch (error) {
      this.aoErrar('Erro ao converter dados seguros do storage:', error);
      this.removeSecureItem(key);
      return null;
    }
  }

  /** Serializa, envelopa (com número de versão) e guarda um objecto, cifrado. */
  public guardarDadosSegurosNoStorage<T>(key: string, dados: T, versao = 1): void {
    this.setSecureItem(key, JSON.stringify({ v: versao, dados }));
  }

  /** Signal reactivo com o valor (string) actual desta chave — local, e também ao mudar noutra tab. */
  public sinalTexto(key: string): Signal<string | null> {
    if (!this.sinaisTexto.has(key)) {
      this.sinaisTexto.set(key, signal(this.getSecureItem(key)));
      this.ligarOuvinteTab();
    }
    return this.sinaisTexto.get(key)!;
  }

  /** Equivalente a `sinalTexto`, para um objecto gravado com `guardarDadosSegurosNoStorage`. */
  public sinalDados<T>(key: string, versao = 1): Signal<T | null> {
    if (!this.sinaisObjecto.has(key)) {
      this.sinaisObjecto.set(key, { sinal: signal(this.buscarDadosSegurosDoStorage<T>(key, versao)), versao });
      this.ligarOuvinteTab();
    }
    return this.sinaisObjecto.get(key)!.sinal as WritableSignal<T | null>;
  }

  /** Remove apenas as chaves geridas por este serviço (nesta e em execuções anteriores) — nunca limpa a storage inteira. */
  public clearSession(): void {
    if (!this.isBrowser()) return;

    const indice = this.lerIndice();
    localStorage.removeItem(AencriptJdecriptDToken.INDICE);
    localStorage.removeItem(AencriptJdecriptDToken.CHAVE_MESTRA);
    this.encryptionKey = null;

    indice.forEach(key => {
      localStorage.removeItem(key);
      this.actualizarSinais(key);
    });
  }

  private actualizarSinais(key: string): void {
    this.sinaisTexto.get(key)?.set(this.getSecureItem(key));

    const entrada = this.sinaisObjecto.get(key);
    if (entrada) entrada.sinal.set(this.buscarDadosSegurosDoStorage(key, entrada.versao));
  }

  private ligarOuvinteTab(): void {
    if (this.ouvinteTabLigado || !this.isBrowser()) return;
    this.ouvinteTabLigado = true;
    window.addEventListener('storage', e => { if (e.key) this.actualizarSinais(e.key); });
  }

  private obterOuCriarChave(): string {
    if (!this.isBrowser()) return '';
    if (this.encryptionKey) return this.encryptionKey;

    let key = localStorage.getItem(AencriptJdecriptDToken.CHAVE_MESTRA);
    if (!key) {
      key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex); // 256 bits
      localStorage.setItem(AencriptJdecriptDToken.CHAVE_MESTRA, key);
    }

    return this.encryptionKey = key;
  }

  /** Índice persistido (não cifrado — só nomes de chaves) das chaves geridas, para o clearSession() ser fiável entre execuções. */
  private lerIndice(): string[] {
    try {
      return JSON.parse(localStorage.getItem(AencriptJdecriptDToken.INDICE) ?? '[]');
    } catch {
      return [];
    }
  }

  private registarChave(key: string): void {
    const indice = this.lerIndice();
    if (!indice.includes(key)) {
      localStorage.setItem(AencriptJdecriptDToken.INDICE, JSON.stringify([...indice, key]));
    }
  }

  private desregistarChave(key: string): void {
    localStorage.setItem(AencriptJdecriptDToken.INDICE, JSON.stringify(this.lerIndice().filter(k => k !== key)));
  }
}
