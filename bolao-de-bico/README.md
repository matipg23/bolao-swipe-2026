# ⚽ Bolão de Bico — Copa do Mundo 2026

Palpite todos os jogos da Copa, do grupo até a final, e compartilhe seus resultados.

---

## O que você precisa antes de começar

- **Node.js** instalado — baixe em [nodejs.org](https://nodejs.org) (qualquer versão 18 ou mais nova)
- Um terminal (Prompt de Comando, PowerShell, ou Terminal do Mac/Linux)

Para verificar se o Node já está instalado, abra o terminal e rode:
```
node --version
```
Se aparecer um número (ex: `v18.20.8`), está pronto.

---

## Como rodar

1. **Descompacte** a pasta `bolao-app` em qualquer lugar do seu computador

2. **Abra o terminal** e navegue até a pasta:
   ```
   cd caminho/para/bolao-app
   ```
   *(No Windows você pode digitar `cd ` e arrastar a pasta direto pro terminal)*

3. **Instale as dependências** (só precisa fazer isso uma vez):
   ```
   npm install
   ```

4. **Inicie o app:**
   ```
   npm run dev
   ```

5. Abra o navegador em **http://localhost:5173**
   *(se essa porta estiver ocupada, o terminal vai mostrar a porta certa, ex: 5174, 5175...)*

6. Para parar o app, volte ao terminal e aperte **Ctrl + C**

---

## Estrutura dos arquivos

```
bolao-app/
├── src/
│   ├── App.jsx       ← todo o app (times, lógica, telas)
│   ├── main.jsx      ← ponto de entrada
│   └── index.css     ← reset CSS (vazio, estilos são inline)
├── index.html        ← página base
├── package.json      ← dependências do projeto
├── vite.config.js    ← configuração do Vite
└── README.md         ← este arquivo
```

---

## Problemas comuns

**"npm não é reconhecido"** → Node.js não está instalado. Baixe em nodejs.org.

**Porta ocupada** → O terminal mostra automaticamente a próxima disponível, só abrir a URL que ele indicar.

**Tela em branco** → Abra o DevTools do navegador (F12) → Console e manda o erro pra mim.
