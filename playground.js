var fs = require('fs');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;

var dom = JSDOM.fromURL('https://e621.net/posts?page=13&tags=fav%3Aitshaze').then(dom => {
  var articles = dom.window.document.querySelectorAll("article");
  console.log(articles);
  console.log(articles.length)
  for (i = 0; i < articles.length; i++) {
    console.log(i);
    console.log(temp[i].getAttribute('data-id'));
  }
});
