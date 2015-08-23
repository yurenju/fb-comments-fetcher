require('shelljs/global');

module.exports = function() {
  var files = ls('-R', 'comments');
  var comments = []

  files.forEach(function(file) {
    if (file.indexOf('.json') === -1 || file.indexOf('index.json') !== -1) {
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
    return a.message.length <= b.message.length ? 1 : -1;
  });

  var output = ['# Top 50 留言長度最長'];
  comments.slice(0, 50).forEach(function(comment) {
    var commentOutput = `
      ## Author: ${comment.from.name}

      * 按讚數：${comment.like_count} 次
      * 文章：${comment.article_title}

      \`\`\`
      ${comment.message}
      \`\`\`

    `;
    output.push(commentOutput.split('\n').map(line => line.trim()).join('\n'));
  });

  return output.join('\n');
}
