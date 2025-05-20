const socket = new WebSocket('ws://localhost:3001');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Cria botão de limpar
const clearButton = document.createElement('button');
clearButton.textContent = 'Limpar Chat';
clearButton.id = 'clearButton';
document.querySelector('.chatbox').insertBefore(clearButton, document.getElementById('form'));

// Função para adicionar mensagens
function appendMessage(sender, content) {
  if (sender === 'cliente') return;
  
  const msg = document.createElement('div');
  msg.className = sender === 'admin' ? 'admin-message' : 'client-message';
  msg.innerHTML = `<strong>${sender}:</strong> ${content}`;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// Listener único para o botão de limpar
clearButton.addEventListener('click', async () => {
  try {
    // Limpa localmente imediatamente
    messages.innerHTML = '';
    
    // Limpa no servidor
    const response = await fetch('/clear-messages');
    console.log(await response.text());
    
    // Adiciona mensagem de sistema
    appendMessage('Sistema', 'Chat limpo com sucesso');
  } catch (error) {
    console.error('Erro ao limpar mensagens:', error);
    appendMessage('Sistema', 'Erro ao limpar o chat');
  }
});

// Listener para mensagens WebSocket
socket.addEventListener('message', (event) => {
  try {
    const msg = JSON.parse(event.data);
    if (msg.sender && msg.content) {
      const displaySender = msg.sender === 'cliente' ? 'Você' : msg.sender;
      appendMessage(displaySender, msg.content);
    }
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
  }
});

// Envio de mensagens
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text && socket.readyState === WebSocket.OPEN) {
    socket.send(text);
    input.value = '';
  }
});