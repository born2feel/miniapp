import { createServer } from 'node:http';
import { validateTelegramInitData } from './validate-init-data.ts';

/**
 * Demo of a protected endpoint. Not deployed to GitHub Pages.
 *
 * The client sends initData in the `Authorization: tma <initData>` header.
 * The server verifies the signature and only then looks the client up in the CRM.
 * The phone number is not taken from the request body but from the contact Telegram
 * sent to the bot after requestContact (the server stores telegram user id → phone).
 */

const botToken = process.env['BOT_TOKEN'];
if (!botToken) {
  console.error('Set the BOT_TOKEN environment variable');
  process.exit(1);
}

const port = Number(process.env['PORT'] ?? 3000);

const server = createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/api/client/profile') {
    res.writeHead(404).end();
    return;
  }

  const [scheme, initData] = (req.headers.authorization ?? '').split(' ');
  const result =
    scheme === 'tma' && initData
      ? validateTelegramInitData(initData, botToken)
      : ({ ok: false, error: 'missing_hash' } as const);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!result.ok || !result.data.user) {
    // Do not reveal the rejection reason to the client — log it on the server only.
    console.warn('initData rejected:', result.ok ? 'missing_user' : result.error);
    res.writeHead(401).end(JSON.stringify({ error: 'unauthorized' }));
    return;
  }

  // Here: find the phone by result.data.user.id and fetch the profile from yclients/amoCRM.
  res.writeHead(200).end(JSON.stringify({ telegramUserId: result.data.user.id }));
});

server.listen(port, () => {
  console.log(`initData verification server: http://localhost:${port}`);
});
