var http = require('http');
var fs = require('fs');
var url = require('url');

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ul>';
  return list;
}

function templateHTML(title, list, body) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', (error, filelist) => {
        var title = 'Welcome';
        var data = 'Hello Node.js';
        var list = templateList(filelist);
        list = list + '</ul>';
        var template = templateHTML(title, list, `<h2>${title}</h2>${data}`);
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readFile(`data/${queryData.id}`, 'utf8', (err, data) => {
        fs.readdir('./data', (error, filelist) => {
          var list = templateList(filelist);
          var title = queryData.id;
          var template = templateHTML(title, list, `<h2>${title}</h2>${data}`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data', (error, filelist) => {
      var title = 'Web-creat';
      var list = templateList(filelist);
      list = list + '</ul>';
      var template = templateHTML(
        title,
        list,
        `<form action="http://localhost:3000/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"/></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit" />
      </p>
    </form>
    `
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === '/create_process') {
    response.writeHead(200);
    response.end('success');
  } else {
    response.writeHead(404);
    response.end('Not found:404');
  }
});

app.listen(3000);
