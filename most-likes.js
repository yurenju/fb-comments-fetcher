require('shelljs/global');

var files = ls('-R', 'comments');
var comments = []

files.forEach(function(file) {
  if (file.indexOf('.json') === -1) {
    return;
  }

  var article = JSON.parse(cat('comments/' + file));
  article.comments.forEach(function(comment) {
    comment.article_url = article.link;
    comment.article_title = article.title;
  });
  comments.push.apply(comments, article.comments);
});

comments.sort(function(a, b) {
  return a.like_count >= b.like_count;
});

comments.forEach(function(comment) {
  console.log('===========================');
  console.log('like: ', comment.like_count);
  console.log('author: ', comment.from.name);
  console.log('author fb link: ', 'http://facebook.com/' + comment.from.id);
  console.log('article link: ', comment.article_url);
  console.log('article title: ', comment.article_title);
  console.log(comment.message);
})
