require('shelljs/global');
var fetch = require('node-fetch');
var feed = require('feed-read');
var RE_LINK = /realtimenews\/article\/new\/(\d+\/\d+)/;
var rssUrl = 'http://www.appledaily.com.tw/rss/create/kind/rnews/type/new';

function getAllComment(url, comments, offset, limit) {
  offset = offset || 0;
  limit = limit || 1000;
  var fullUrl = url + '&offset=' + offset + '&limit=' + limit;
  var promise = fetch(fullUrl).then(function(res) {
    return res.json();
  }).then(function(json) {
    var articleUrl = Object.keys(json)[0];
    var article = json[articleUrl];
    comments.push.apply(comments, article.comments.data);
    var next = article.comments.data.length > 0 && article.comments.paging.next;
    if (next) {
      return getAllComment(url, comments, offset+limit, limit);
    } else {
      return comments;
    }
  });

  return promise;
}

feed(rssUrl, function(err, items) {
  items.reduce(function(seq, item, index) {
    var article = { title: item.title };
    var matched = item.link.match(RE_LINK);
    article.id = matched[1];
    article.link = item.link.substring(0, item.link.length-1);

    return seq.then(function() {
      console.log('processing ', index, '/', items.length);
      console.log('  title: ', article.title);
      console.log('  url: ', article.link);
      var url = 'https://graph.facebook.com/comments/?ids=' +
                encodeURIComponent(article.link);

      return getAllComment(url, []);
    }).then(function(comments) {
      console.log('  comments: ', comments.length);
      article.comments = comments;
      var folder = article.id.split('/')[0];
      var filename = article.id.split('/')[1] + '.json';
      mkdir('-p', 'comments/' + folder);
      JSON.stringify(article, null, 2)
        .to('comments/' + folder + '/' + filename);
    }).catch(function(err) {
      console.error(err);
    });
  }, Promise.resolve())
  .then(function() {
    var index = ls('-R', 'comments').filter(function(file) {
      return file.indexOf('.json') !== -1;
    });
    JSON.stringify(index, null, 2).to('comments/index.json');
  });
});
