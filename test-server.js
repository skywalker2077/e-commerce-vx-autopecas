const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>VX Autopeças - Teste</title>
    </head>
    <body>
      <h1>Servidor de Teste - VX Autopeças</h1>
      <p>Se você está vendo isto, o servidor está funcionando!</p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    </body>
    </html>
  `);
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de teste rodando em http://localhost:${PORT}`);
  console.log(`Também disponível em http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('Erro no servidor:', err.message);
});