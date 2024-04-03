import express from 'express';
import next from 'next';
import ipFilter from 'express-ip-access-control';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Defina aqui o IP que deseja permitir o acesso
  const allowedIP = '192.168.0.1';

  // Middleware para controlar o acesso por IP
  server.use(ipFilter({ mode: 'allow', allow: [allowedIP] }));

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err?: any) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});