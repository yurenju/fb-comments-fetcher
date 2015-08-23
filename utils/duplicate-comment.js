require('shelljs/global');


module.exports = function() {
  var files = ls('-R', 'comments');
  var comments = {};
  var commentsArray = [];

  files.forEach(function(file) {
    if (file.indexOf('.json') === -1 || file.indexOf('index.json') !== -1) {
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
    return a.comments.length <= b.comments.length ? 1 : -1;
  });

  var output = ['# Top 10 重複留言\n'];
  commentsArray.slice(0, 10).forEach(function(comment) {
    var commentOutput = [];
    commentOutput.push(`\n## 重複次數 ${comment.comments.length}\n`);
    commentOutput.push('留言：\n');
    commentOutput.push(`\`\`\`\n${comment.message}\n\`\`\`\n`);
    var users = {};
    comment.comments.forEach(function(c) {
      if (users[c.from.name]) {
        users[c.from.name].count++;
      } else {
        users[c.from.name] = {count: 1, id: c.from.id};
      }
    });
    commentOutput.push('users: \n');
    for (var user in users) {
      commentOutput.push(`* [${user}]('http://facebook.com/' + users[user].id) (重複 ${users[user].count} 次)`);
    }
    commentOutput.push('\n新聞：\n');
    comment.comments.forEach(function(c) {
      commentOutput.push(`* ${c.article_title}`);
    });
    output.push(commentOutput.join('\n'));
  });

  return output.join('\n');
}
