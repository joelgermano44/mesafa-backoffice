import { TestBed } from '@angular/core/testing';

import { AencriptJdecriptDToken } from './aencript-jdecript-dtoken';

describe('AencriptJdecriptDToken', () => {
  let service: AencriptJdecriptDToken;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AencriptJdecriptDToken);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('cifra o valor gravado (não fica em texto plano no localStorage)', () => {
    service.setSecureItem('chave-teste', 'valor-secreto');

    const bruto = localStorage.getItem('chave-teste');
    expect(bruto).not.toBeNull();
    expect(bruto).not.toContain('valor-secreto');
  });

  it('devolve o valor original após cifrar e decifrar (round-trip)', () => {
    service.setSecureItem('chave-teste', 'valor-secreto');

    expect(service.getSecureItem('chave-teste')).toBe('valor-secreto');
  });

  it('limpa automaticamente uma entrada corrompida/adulterada e devolve null', () => {
    service.setSecureItem('chave-teste', 'valor-secreto');
    localStorage.setItem('chave-teste', 'isto-nao-e-uma-cifra-valida');

    expect(service.getSecureItem('chave-teste')).toBeNull();
    expect(localStorage.getItem('chave-teste')).toBeNull();
  });

  it('guardarDadosSegurosNoStorage/buscarDadosSegurosDoStorage fazem round-trip de um objecto', () => {
    const dados = { id: 1, nome: 'Ana' };
    service.guardarDadosSegurosNoStorage('chave-objecto', dados);

    expect(service.buscarDadosSegurosDoStorage<typeof dados>('chave-objecto')).toEqual(dados);
  });

  it('descarta (e remove) um envelope de uma versão diferente da esperada', () => {
    service.guardarDadosSegurosNoStorage('chave-versionada', { nome: 'Ana' }, 1);

    expect(service.buscarDadosSegurosDoStorage('chave-versionada', 2)).toBeNull();
    expect(localStorage.getItem('chave-versionada')).toBeNull();
  });

  it('mantém a chave de cifragem partilhada entre "tabs" (instâncias diferentes do serviço)', () => {
    service.setSecureItem('chave-partilhada', 'valor-secreto');

    // Uma segunda instância simula uma segunda tab: deve conseguir decifrar o que a primeira gravou,
    // porque a chave AES vive em localStorage (partilhado entre tabs), não em sessionStorage.
    const segundaInstancia = new AencriptJdecriptDToken();

    expect(segundaInstancia.getSecureItem('chave-partilhada')).toBe('valor-secreto');
  });

  it('clearSession() remove só as chaves geridas por este serviço, não a storage inteira', () => {
    service.setSecureItem('chave-do-servico', 'valor-secreto');
    localStorage.setItem('chave-de-outra-app', 'nao-deve-ser-tocada');

    service.clearSession();

    expect(localStorage.getItem('chave-do-servico')).toBeNull();
    expect(localStorage.getItem('chave-de-outra-app')).toBe('nao-deve-ser-tocada');
  });

  it('removeSecureItem() remove a entrada do localStorage', () => {
    service.setSecureItem('chave-teste', 'valor-secreto');
    service.removeSecureItem('chave-teste');

    expect(service.getSecureItem('chave-teste')).toBeNull();
  });

  it('hasSecureItem() indica presença sem decifrar', () => {
    expect(service.hasSecureItem('chave-teste')).toBeFalse();
    service.setSecureItem('chave-teste', 'valor-secreto');
    expect(service.hasSecureItem('chave-teste')).toBeTrue();
  });

  it('definirTratadorDeErro() substitui o tratamento de erro por omissão', () => {
    const erros: string[] = [];
    service.definirTratadorDeErro(msg => erros.push(msg));

    service.guardarDadosSegurosNoStorage('chave-versionada', { nome: 'Ana' }, 1);
    service.buscarDadosSegurosDoStorage('chave-versionada', 2);

    expect(erros.length).toBe(1);
  });

  it('sinalTexto() reflecte o valor actual e actualiza-se ao gravar/remover localmente', () => {
    const sinal = service.sinalTexto('chave-teste');
    expect(sinal()).toBeNull();

    service.setSecureItem('chave-teste', 'valor-secreto');
    expect(sinal()).toBe('valor-secreto');

    service.removeSecureItem('chave-teste');
    expect(sinal()).toBeNull();
  });

  it('sinalDados() reflecte o valor actual e actualiza-se ao gravar/remover localmente', () => {
    const sinal = service.sinalDados<{ nome: string }>('chave-objecto');
    expect(sinal()).toBeNull();

    service.guardarDadosSegurosNoStorage('chave-objecto', { nome: 'Ana' });
    expect(sinal()).toEqual({ nome: 'Ana' });

    service.removeSecureItem('chave-objecto');
    expect(sinal()).toBeNull();
  });

  it('sinalTexto()/sinalDados() actualizam-se também quando a chave muda noutra tab (evento storage)', () => {
    service.setSecureItem('chave-teste', 'valor-secreto');
    const sinal = service.sinalTexto('chave-teste');
    expect(sinal()).toBe('valor-secreto');

    // Outra tab (outra instância) remove a chave; o evento storage chega a esta instância.
    const outraInstancia = new AencriptJdecriptDToken();
    outraInstancia.removeSecureItem('chave-teste');
    window.dispatchEvent(new StorageEvent('storage', { key: 'chave-teste' }));

    expect(sinal()).toBeNull();
  });

  it('clearSession() remove chaves geridas mesmo numa instância nova (índice persistido entre execuções)', () => {
    service.setSecureItem('chave-antiga', 'valor-secreto');

    // Nova instância, sem qualquer leitura/escrita desta chave nesta execução — simula uma nova
    // carga de página que só chama clearSession() (ex: logout) sem ter relido a chave primeiro.
    const outraInstancia = new AencriptJdecriptDToken();
    outraInstancia.clearSession();

    expect(localStorage.getItem('chave-antiga')).toBeNull();
  });
});
