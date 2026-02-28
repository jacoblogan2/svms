const http = require('http');

const req = http.request('http://localhost:8000/api/v1/users/citizen', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});

req.on('error', (e) => console.error('Error:', e.message));
req.setTimeout(5000, () => {
  console.log('Request timed out!');
  req.abort();
});
req.end();
