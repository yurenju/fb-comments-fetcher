require('shelljs/global');

var files = ls('-R', 'comments');
var comments = {};
var commentsArray = [];

files.forEach(function(file) {
  if (file.indexOf('.json') === -1) {
    return;
  }

  var article = JSON.parse(cat('comments/' + file));
  article.comments.forEach(function(comment) {
    comment.article_title = article.title;
    comment.article_url = article.link;
    if (comments[comment.message]) {
      comments[comment.message].push(comment);
    } else {
      comments[comment.message] = [comment];
    }
  })
});

commentsArray = Object.keys(comments).map(function(msg) {
  return {
    message: msg,
    comments: comments[msg]
  };
});

commentsArray.sort(function(a, b) {
  return a.comments.length >= b.comments.length;
});

commentsArray.forEach(function(comment) {
  console.log('=======================');
  console.log('comment count: ', comment.comments.length);
  console.log('摘要：', comment.message.substr(0, 20));
  var users = {};
  comment.comments.forEach(function(c) {
    if (users[c.from.name]) {
      users[c.from.name].count++;
    } else {
      users[c.from.name] = {count: 1, id: c.from.id};
    }
  });
  console.log('users: ');
  for (var user in users) {
    console.log(' - ' + user + ' (' + users[user].count + ' 次)');
    console.log('   ' + 'http://facebook.com/' + users[user].id);
  }
  console.log('新聞：');
  comment.comments.forEach(function(c) {
    console.log(' - ', c.article_title);
    console.log('   ', c.article_url);
  });
});
