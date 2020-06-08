var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

var templateObject = require("./lib/tempate.js");

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (error, filelist) => {
        var title = "Welcome";
        var data = "Hello Node.js";
        var list = templateObject.list(filelist);
        list = list + "</ul>";
        var template = templateObject.html(
          title,
          list,
          `<h2>${title}</h2>${data}`,
          `<a href="/create">create</a> `
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
        fs.readdir("./data", (error, filelist) => {
          var list = templateObject.list(filelist);
          var title = queryData.id;
          var template = templateObject.html(
            title,
            list,
            `<h2>${title}</h2>${data}`,
            `<div><a href="/create">create</a> <a href="/update?id=${title}">update</a> 
            <form action="/delete_process" method="post"><input type="hidden" name="id" value="${title}">
            <input type="submit" value="delete"/></form>`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", (error, filelist) => {
      var title = "Web-creat";
      var list = templateObject.list(filelist);
      list = list + "</ul>";
      var template = templateObject.html(
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
    `,
        ""
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id${title}` });
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
      fs.readdir("./data", (error, filelist) => {
        var list = templateObject.list(filelist);
        var title = queryData.id;
        var template = templateObject.html(
          title,
          list,
          `<form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"/></p>
          <p>
            <textarea name="description" placeholder="description">${data}</textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>`,
          ``
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      s;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: `/?id${title}` });
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      console.log(id);
      fs.unlink(`data/${id}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found:404");
  }
});

app.listen(3000);
