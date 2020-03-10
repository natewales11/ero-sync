var fs = require('fs');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
var terminate = require('terminate');
var https = require("https");
// var promise = require('promise');

const MAX_IMAGES = 100;
const BASE_URI = "https://e621.net/posts?page=";
// const TARGET_FOLDER = __dirname + "/pics/"
const TARGET_FOLDER = "./pics/";
/*
##### Image Model #####
{
  id,
  fullres_url
}
*/

var tags = [
  "fav:itshaze"
];

var tagList = "&tags=";
for (item in tags) {
  tagList += encodeURIComponent(tags) + "+";
}
tagList = tagList.substring(0, tagList.length - 1);
console.log('tagList: ' + tagList);

var contentList = [];
var isContent = true;
var pageNum = 1;

var doNextPage = function () {
  var thisUrl = BASE_URI + pageNum + tagList;
  console.log("Querying " + thisUrl);
  const dom = JSDOM.fromURL(thisUrl, {})
    .then(dom => {
      var articles = dom.window.document.querySelectorAll("article");
      console.log("Retrieved " + articles.length + " items from " + thisUrl);

      // Put each of the articles in our list
      for (i = 0; i < articles.length; i++) {
        contentList.push({
          id: articles[i].getAttribute('data-id'),
          fullres_url: articles[i].getAttribute('data-file-url')
        });
      }

      // Stop looping if there's no more content, or make next call
      if (articles.length == 0 || contentList.length > MAX_IMAGES) {
        isContent = false;
        clearTimeout();
        saveNeededImages();
      } else {
        pageNum += 1;
        setTimeout(doNextPage, 1500);
      }
  }).catch(function(err) {
    console.log(err);
    terminate(process.pid, function(err) {
      console.log("Terminating due to error.");
    });
  });
}

var saveNeededImages = function () {
  // TODO delete images saved in the folder that are no longer needed, save ones we do need
  console.log(contentList);
  console.log("Got " + contentList.length + " results!");
  console.log("Deleting pictures in " + TARGET_FOLDER + " that aren't in our list");

  contentList.forEach((element) => {
    var filename = TARGET_FOLDER + element.id + '.' + element.fullres_url.split('.').pop();
    if (!fs.existsSync(filename)) {
      https.get(element.fullres_url, response => {
        console.log("writing " + filename);
        response.pipe(fs.createWriteStream(filename));
      });
    } else {
      console.log(filename + " already exists! Skipping!");
    }
  })

  // for (i = 0; i < contentList.length; i++) {
  //
  // }
}

console.log('Initial doNextPage call');
doNextPage();

console.log("All done!");
console.log(contentList);
//console.log(temp.childNodes.innerHTML);
