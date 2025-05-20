const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

// Banco SQLite
const db = new sqlite3.Database('./messages.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Função opcional de "admin bot"
function adminResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  if (lower.includes('oi') || lower.includes('olá')) return 'Olá! Como posso te ajudar?';
  if (lower.includes('locais')) return 'Aqui estão os locais de Belém';
  if (lower.includes('obrigado') || lower.includes('obrigada')) return 'De nada! 😊';
  return null;
}

// WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Envia mensagens antigas
  db.all('SELECT * FROM messages ORDER BY timestamp ASC', [], (err, rows) => {
    if (!err) {
      rows.forEach(msg => {
        ws.send(JSON.stringify(msg));
      });
    }
  });

  ws.on('message', (data) => {
    const message = data.toString();

    // Salva no banco como "cliente"
    db.run(`INSERT INTO messages (sender, content) VALUES (?, ?)`, ['Você', message]);

    // Envia para todos os clientes
    const userMsg = JSON.stringify({ sender: 'Você', content: message });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(userMsg);
      }
    });

    // Admin responde (simulado)
    const reply = adminResponse(message);
    if (reply) {
      setTimeout(() => {
        db.run(`INSERT INTO messages (sender, content) VALUES (?, ?)`, ['admin', reply]);
        const botMsg = JSON.stringify({ sender: 'admin', content: reply });
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(botMsg);
          }
        });
      }, 1000);
    }
  });
});
 
server.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Porta 3001 em uso, tentando outra porta...');
    server.listen(0, () => {
      console.log(`Servidor rodando na porta ${server.address().port}`);
    });
  } else {
    console.error('Erro ao iniciar servidor:', err);
  }
});

// Adicione esta rota para limpar o banco de dados (corrigida)
app.get('/clear-messages', (req, res) => {
  db.run('DELETE FROM messages', (err) => {
    if (err) {
      return res.status(500).send('Erro ao limpar mensagens');
    }
    res.send('Mensagens limpas com sucesso');
    // Notificar todos os clientes via WebSocket
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ 
          type: 'system',
          content: 'Chat limpo pelo administrador'
        }));
      }
    });
  });
});