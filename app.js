const express = require('express');
const app = express();
const port = 7754;
var cowsay = require('cowsay');

var concat = require('concat-stream');
app.use(function(req, res, next) {
  req.pipe(
    concat(function(data) {
      req.body = data;
      next();
    })
  );
});

app.all('/week24/login', (req, res) => {
  if (req.method !== 'POST') {
    res.send('<h1>FAILED LOGIN 💔</h1>');
    return;
  }

  const body = req.body.toString();
  const pairs = req.body.toString().split('&');
  if (pairs.length !== 2) {
    res.send('<h1>FAILED LOGIN 💔</h1>');
    return;
  }

  if (
    body.includes('username=HTC') &&
    body.includes('password=goatbanjorodeo')
  ) {
    res.send(`<pre>${cowsay.say({ text: 'Login Success!! MOOOO' })}</pre>`);
    return;
  }
  res.send('<h1>FAILED LOGIN 💔</h1>');
  return;
});

app.all('/week24/echo', (req, res) => {
  let params = '';
  if (req.method === 'GET' && Object.keys(req.query).length) {
    str = Object.keys(req.query)
      .map(name => `${name}=${req.query[name]}`)
      .join('&');
    params += `<h2>GET Query String: <code>?${str}</code></h2>`;
    params += '<h2>GET Query Params:</h2><ul>';
    params += Object.keys(req.query || {})
      .map(name => `<li>${name}: ${req.query[name]}</li>`)
      .join('');
    params += '</ul>';
  }

  let post = '';
  if (req.method === 'POST') {
    post += `<h2>Raw HTTP body: <code>${req.body}</code></h2>`;
    post += '<h2>POST-ed form data:</h2><ul>';
    const pairs = req.body.toString().split('&');
    post += pairs
      .map(pair => {
        const [key, value] = pair.split('=');
        return `<li>${key}: ${value}</li>`;
      })
      .join('');
    post += '</ul>';
  }

  res.send(`
  <style>
  body {
    padding: 20px;
  }
  li {
    font-size: 1.5em;
    margin-left: 2em;
  }
  code {
    color: red;
    font-size: 1.5em;
  }
  </style>
  <h1>HTTP Method: <code>${req.method}</code> </h1>
 ${params} 
 ${post}
  `);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
