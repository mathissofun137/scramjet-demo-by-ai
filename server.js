const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

function normalizeTarget(rawUrl) {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

app.get('/proxy', async (req, res) => {
  const rawUrl = req.query.url;
  const target = normalizeTarget(rawUrl);

  if (!target) {
    return res.status(400).send('Missing or invalid URL. Example: /proxy?url=https://example.com');
  }

  try {
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebProxyDemo/1.0)'
      }
    });

    const contentType = response.headers.get('content-type') || 'text/html';
    const text = await response.text();

    res.setHeader('Content-Type', contentType.includes('text/html') ? 'text/html; charset=utf-8' : contentType);
    res.send(text);
  } catch (error) {
    console.error('Proxy fetch failed:', error.message);
    res.status(502).send('Proxy fetch failed. The remote site may block requests or be unreachable.');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
