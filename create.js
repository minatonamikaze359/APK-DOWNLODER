// Vercel serverless function (Node) - proxy to the APK conversion service
// Place this file under the `api/` directory in your repo root.
// It forwards the request to the upstream converter and returns either JSON/text or binary APK.
// CORS headers are included to allow browser access.
const upstreamBase = 'https://url-to-apk-convert.bjcoderx.workers.dev/create';

module.exports = async (req, res) => {
  // Allow CORS (adjust for production domain instead of '*')
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const name = req.query.name;
  const link = req.query.link;
  if (!name || !link) {
    return res.status(400).json({ error: 'name and link query parameters are required' });
  }

  const upstreamUrl = `${upstreamBase}?name=${encodeURIComponent(name)}&link=${encodeURIComponent(link)}`;
  try {
    const r = await fetch(upstreamUrl, { method: 'GET' });

    // Forward status
    res.statusCode = r.status;

    // Get headers from upstream
    const contentType = r.headers.get('content-type') || '';
    // If upstream returns JSON/text, forward as text/json
    if (contentType.includes('application/json') || contentType.startsWith('text/')) {
      const text = await r.text();
      // Try to parse JSON
      try {
        const j = JSON.parse(text);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(JSON.stringify(j));
      } catch (e) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.end(text);
      }
    } else {
      // Binary response (APK). Stream as array buffer and set correct headers.
      const arrayBuffer = await r.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const upstreamCT = contentType || 'application/octet-stream';
      res.setHeader('Content-Type', upstreamCT);
      // Let browser download with a suggested filename
      res.setHeader('Content-Disposition', `attachment; filename="${name}.apk"`);
      res.setHeader('Content-Length', buffer.length);
      return res.end(buffer);
    }
  } catch (err) {
    console.error('Upstream fetch failed', err);
    return res.status(502).json({ error: 'failed to contact upstream', details: String(err) });
  }
};
