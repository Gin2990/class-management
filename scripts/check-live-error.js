const https = require('https');

https.get('https://class-management-ebon.vercel.app/api/students', (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Body:', body);
  });
}).on('error', (e) => {
  console.log('Error:', e.message);
});
