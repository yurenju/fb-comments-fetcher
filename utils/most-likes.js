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
    return a.like_count <= b.like_count ? 1 : -1;
  });

  var output = ['# Top 100 按讚數最多\n']
  comments.slice(0, 100).forEach(function(comment) {
    var commentOutput = `
    ## Like: ${comment.like_count}

    * Author: [${comment.from.name}](http://facebook.com/${comment.from.id})
    * Article: ${comment.article_title}

    \`\`\`
    ${comment.message}
    \`\`\`
    `;
    output.push(commentOutput.split('\n').map(line => line.trim()).join('\n'));
  });

  return output.join('\n');
}
