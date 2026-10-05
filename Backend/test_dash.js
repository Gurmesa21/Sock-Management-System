const http = require('http');

function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost', port: 5000, path, method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) options.headers['Authorization'] = 'Bearer ' + token;
    const req = http.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  const login = await request('POST', '/api/v1/auth/login', { username: 'admin', password: 'Wisdom212314' });
  const token = JSON.parse(login.body).data.token;
  console.log('Login:', login.status);

  const dash = await request('GET', '/api/v1/dashboard/overview', null, token);
  console.log('Dashboard:', dash.status);
  if (dash.status !== 200) {
    console.log('Error:', dash.body.substring(0, 500));
  } else {
    const data = JSON.parse(dash.body).data;
    console.log('Summary:', JSON.stringify(data.summary));
  }
}

test().catch(console.error);
