# AencriptJdecriptDToken

Serviço genérico de leitura/escrita **cifrada (AES)** em `localStorage`. Não tem nenhuma
dependência deste projecto (nem modelos, nem configs, nem outros serviços) — pode ser copiado
tal e qual para qualquer outra aplicação Angular.

Ficheiro: `src/app/services/aencript-jdecript-dtoken.ts`

---

## 1. Para que serve

Guardar no `localStorage` qualquer dado que não deva ficar visível em texto plano no separador
"Application" do devtools — tokens de autenticação, dados pessoais em cache, rascunhos de
formulários — cifrando-o com AES antes de gravar, e decifrando-o ao ler.

Expõe também esse mesmo valor como um **signal reactivo do Angular**, que se actualiza sozinho
sempre que o valor muda — localmente ou noutra tab do browser.

---

## 2. Fluxo da funcionalidade

### 2.1 A chave de cifragem

```
ASSINATURA ('$_dom@Jam_Adri3D')
        │
        ▼  SHA-256, primeiros 24 caracteres
CHAVE_MESTRA (nome da entrada no localStorage)
        │
        ▼  na 1ª utilização, se ainda não existir:
Gera 256 bits aleatórios → grava em localStorage[CHAVE_MESTRA] → guarda em cache (this.encryptionKey)
```

- A chave AES real é aleatória e só é criada uma vez; fica guardada (ela própria) em
  `localStorage`, não em `sessionStorage`. Isto é deliberado: `sessionStorage` não é partilhado
  entre separadores (tabs) da mesma origem — se a chave lá estivesse, cada tab geraria a sua
  própria chave e falharia a decifrar o que outra tab tivesse gravado, levando à limpeza
  automática (e, na prática, ao logout) dessa tab. Com a chave em `localStorage`, todas as tabs
  da mesma origem partilham a mesma chave.
- `ASSINATURA`/`CHAVE_MESTRA` **não devem ser removidas nem alteradas** — fazem parte de como a
  chave é derivada.

### 2.2 Gravar e ler um valor simples (como token)

```
setSecureItem(key, valor)
  → AES.encrypt(valor, chave) → localStorage.setItem(key, cifrado)
  → regista "key" no índice de chaves geridas
  → actualiza o signal desta chave, se existir

getSecureItem(key)
  → lê localStorage.getItem(key)
  → AES.decrypt(..., chave)
  → se falhar ou vier vazio → remove a entrada corrompida e devolve null
  → caso contrário devolve o texto original
```

### 2.3 Gravar e ler um objecto (com versão, como dados de um usuário)

`guardarDadosSegurosNoStorage`/`buscarDadosSegurosDoStorage` são o mesmo fluxo acima, mas o valor
gravado é um **envelope** `{ v: versao, dados: T }` em JSON:

```
guardarDadosSegurosNoStorage(key, dados, versao = 1)
  → setSecureItem(key, JSON.stringify({ v: versao, dados }))

buscarDadosSegurosDoStorage<T>(key, versao = 1)
  → getSecureItem(key) → JSON.parse
  → se envelope.v !== versao → avisa e descarta (remove a entrada), devolve null
  → caso contrário devolve envelope.dados
```

Isto existe para o caso de, numa versão futura do projecto, a forma de `T` mudar — dados antigos
gravados com outra versão são descartados em vez de serem confiados às cegas (o que poderia
rebentar código que espera campos que já não existem).

### 2.4 Índice persistido (para o `clearSession()` ser fiável)

Cada `setSecureItem`/`removeSecureItem` actualiza também uma pequena lista **não cifrada** (só
nomes de chaves, nunca valores) guardada em `localStorage[__ajd_idx]`. É essa lista que
`clearSession()` usa para saber exactamente o que remover — mesmo que a chave tenha sido gravada
numa execução anterior da página e nunca mais tenha sido lida nesta.

### 2.5 Signals reactivos (`sinalTexto` / `sinalDados`)

```
sinalTexto(key) / sinalDados<T>(key)
  → na 1ª chamada: cria um signal com o valor actual e liga (uma única vez) um listener
    ao evento nativo "storage" da janela
  → devolve sempre a mesma instância do signal para a mesma key (cache interna)

Sempre que:
  - esta instância chama setSecureItem/removeSecureItem para essa key, OU
  - outra tab muda essa key (evento "storage")
  → o signal é actualizado automaticamente
```

Um consumidor (ex: `InfoAuth`) só precisa de ler `sinal()` — nunca precisa de chamar `.set()`
manualmente nem de subscrever nada.

### 2.6 Limpeza automática de dados corrompidos

Sempre que a decifragem falha (ex: alguém editou o valor manualmente no devtools, ou o formato
mudou de forma incompatível), a entrada é removida do `localStorage` automaticamente — a função
devolve `null` em vez de rebentar.

---

## 3. API pública

| Função | Para quê |
|---|---|
| `setSecureItem(key, valor)` | Grava uma string cifrada |
| `getSecureItem(key)` | Lê e decifra uma string |
| `removeSecureItem(key)` | Remove uma entrada |
| `hasSecureItem(key)` | Indica se existe, sem decifrar |
| `guardarDadosSegurosNoStorage(key, dados, versao?)` | Grava um objecto qualquer (JSON), cifrado e versionado |
| `buscarDadosSegurosDoStorage<T>(key, versao?)` | Lê um objecto gravado com a função acima |
| `sinalTexto(key)` | `Signal<string \| null>` reactivo, para um valor simples |
| `sinalDados<T>(key, versao?)` | `Signal<T \| null>` reactivo, para um objecto |
| `definirTratadorDeErro(handler)` | Substitui o `console.error` por omissão por um logger próprio do projecto |
| `clearSession()` | Remove só as chaves geridas por este serviço (nunca `localStorage`/`sessionStorage` inteiros) |

---

## 4. Como usar noutro projecto

1. **Copiar o ficheiro** `aencript-jdecript-dtoken.ts` para o novo projecto (ex:
   `core/services/`).
2. **Instalar a única dependência externa:**
   ```bash
   npm install crypto-js @types/crypto-js
   ```
3. **Injectar** onde for preciso:
   ```ts
   private storageSeguro = inject(AencriptJdecriptDToken);
   ```
4. **Valor simples** (ex: um token JWT) — duas formas de ler, conforme o que precisares:

   **Leitura pontual** (só quero o valor agora, uma vez, ex: para pôr num header HTTP):
   ```ts
   this.storageSeguro.setSecureItem('minhaAppToken', token);
   const token = this.storageSeguro.getSecureItem('minhaAppToken');
   ```

   **Leitura reactiva** (é assim que o `InfoAuth` deste projecto faz — o valor fica sempre
   actualizado, mesmo que mude noutra tab, sem teres de o voltar a ler):
   ```ts
   export class MeuServico {
     private storageSeguro = inject(AencriptJdecriptDToken);

     readonly token = this.storageSeguro.sinalTexto('minhaAppToken');
     readonly autenticado = computed(() => this.token() !== null);
   }
   ```
   `sinalTexto(key)` devolve sempre a mesma instância do signal para essa chave — chama-se **uma
   vez**, ao declarar o campo (como em cima), nunca dentro de um método que corre várias vezes.
   Depois, para ler o valor actual em qualquer sítio (template ou código), chama-se `this.token()`.
   Gravar/remover com `setSecureItem`/`removeSecureItem` actualiza este signal sozinho — não
   precisas (nem deves) de lhe chamar `.set(...)` directamente.

5. **Um objecto qualquer** — define primeiro o tipo (isto é sempre teu, o serviço não o conhece):
   ```ts
   interface Carrinho { itens: { produtoId: number; quantidade: number }[]; total: number; }

   this.storageSeguro.guardarDadosSegurosNoStorage('minhaAppCarrinho', carrinho);
   const carrinho = this.storageSeguro.buscarDadosSegurosDoStorage<Carrinho>('minhaAppCarrinho');
   ```
6. **Signal reactivo para um objecto** — o mesmo princípio do ponto 4, mas com `sinalDados`:
   ```ts
   readonly carrinho = this.storageSeguro.sinalDados<Carrinho>('minhaAppCarrinho');
   readonly totalItens = computed(() => this.carrinho()?.itens.length ?? 0);
   ```
7. **Logger próprio** (opcional):
   ```ts
   this.storageSeguro.definirTratadorDeErro((msg, err) => meuServicoDeLogs.registar(msg, err));
   ```

Não há nada a configurar em `app.config.ts` — o serviço não precisa de providers especiais.

### ⚠️ Projectos Angular mais antigos

Este ficheiro usa o decorator `@Service()`, disponível apenas nas versões mais recentes do
Angular. **Em projectos mais antigos**, troca:

```ts
@Service()
export class AencriptJdecriptDToken { ... }
```

por:

```ts
@Injectable({
  providedIn: 'root',
})
export class AencriptJdecriptDToken { ... }
```

(e o import correspondente, de `Injectable` em vez de `Service`, a partir de `@angular/core`). O
comportamento é equivalente para este caso — um serviço singleton — nada mais no ficheiro precisa
de mudar.

---

## 5. Limitações a ter em conta

- **Isto não é protecção contra XSS.** Cifrar no browser defende-se de uma leitura casual do
  `localStorage`, não de um script malicioso a correr na própria página — esse script consegue
  sempre chamar os mesmos métodos e decifrar os dados, tal como o resto da aplicação. Para
  proteger verdadeiramente um token contra XSS, a solução seria um cookie `httpOnly` definido
  pelo backend, o que é uma mudança de arquitectura, não algo que este ficheiro resolva sozinho.
- **`ASSINATURA`/`CHAVE_MESTRA` não são configuráveis por design** — propositadamente, para que
  não sejam trivialmente removidas ao reutilizar o ficheiro.
