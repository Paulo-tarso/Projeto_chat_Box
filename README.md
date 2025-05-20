# **Chat App - Cliente/Admin**  

📌 **Um sistema de chat simples com respostas automáticas de um bot "admin"**, armazenando todas as mensagens em um banco de dados SQLite.  

---

## **📋 Funcionalidades**  

✅ **Chat em tempo real** usando WebSocket  
✅ **Histórico de mensagens** salvo no banco de dados  
✅ **Respostas automáticas** do bot "admin" para palavras-chave  
✅ **Limpeza do chat** (local e no servidor)  
✅ **Interface simples** com estilização CSS  

---

## **🛠️ Tecnologias Utilizadas**  

- **Backend**:  
  - Node.js  
  - Express  
  - WebSocket (ws)  
  - SQLite3 (banco de dados)  

- **Frontend**:  
  - HTML5  
  - CSS3  
  - JavaScript (WebSocket API)  

---

## **⚙️ Como Executar o Projeto**  

### **Pré-requisitos**  
- Node.js instalado  
- NPM ou Yarn  

### **Passo a Passo**  

1. **Clone o repositório**  
   ```sh
   git clone [URL_DO_REPOSITÓRIO]
   cd chat-app
   ```

2. **Instale as dependências**  
   ```sh
   npm install
   # ou
   yarn install
   ```

3. **Inicie o servidor**  
   ```sh
   node server.js
   ```
   - O servidor rodará em `http://localhost:3001` (ou outra porta disponível).  

4. **Acesse o chat**  
   - Abra `public/index.html` no navegador.  

---

## **📂 Estrutura do Projeto**  

```
chat-app/
├── public/
│   ├── index.html        # Página principal do chat
│   ├── script.js         # Lógica do cliente (WebSocket)
│   └── styles.css        # Estilos do chat
│
├── server.js            # Servidor Node.js + WebSocket
├── messages.db          # Banco de dados SQLite (criado automaticamente)
├── package.json         # Dependências do projeto
└── README.md            # Este arquivo
```

---

## **🤖 Como o Bot "Admin" Funciona**  

O bot responde automaticamente a estas palavras-chave:  

| **Palavra**  | **Resposta**                     |
|-------------|----------------------------------|
| "oi", "olá" | "Olá! Como posso te ajudar?"     |
| "locais"    | "Aqui estão os locais de Belém"  |
| "obrigado"  | "De nada! 😊"                    |

---

## **🧹 Como Limpar o Chat**  

1. **Limpeza local** (apenas no navegador):  
   - Clique em **"Limpar Chat"** para remover as mensagens da tela.  

2. **Limpeza no servidor** (apaga o histórico do banco de dados):  
   - O servidor possui uma rota `/clear-messages` que deleta todas as mensagens.  
   - Todos os clientes conectados são notificados.  

---

## **🔍 Possíveis Problemas e Soluções**  

| **Problema**                     | **Solução**                                      |
|----------------------------------|------------------------------------------------|
| **Porta já em uso** (`EADDRINUSE`) | Mude a porta no `server.js` ou mate o processo. |
| **Mensagens duplicadas**          | Verifique o `script.js` (evite `appendMessage` duplicado). |
| **Bot não responde**              | Confira a função `adminResponse` no `server.js`. |

---

## **📜 Licença**  

None.  
