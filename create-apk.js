// Node CLI: create-apk.js
// Usage: node cli/create-apk.js <name> <link>
const https = require('https');
const url = require('url');

const [,, name, link] = process.argv;
if (!name || !link) {
  console.error('Usage: node cli/create-apk.js <name> <link>');
  process.exit(1);
}

const endpoint = `https://url-to-apk-convert.bjcoderx.workers.dev/create?name=${encodeURIComponent(name)}&link=${encodeURIComponent(link)}`;

https.get(endpoint, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // try parse JSON
    try {
      const parsed = JSON.parse(data);
      console.log('Response JSON:', parsed);
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
}).on('error', (err) => {
  console.error('Request error:', err);
});
