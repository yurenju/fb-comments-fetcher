require('babel/register');
require('shelljs/global');

mkdir('-p', 'comments/reports');

var filenames = [];

reports = ls('utils')
  .filter(function(file) {
    return file.indexOf('report.js') === -1;
  })
  .forEach(function(file) {
    var m = require('./' + file);
    var filename = 'comments/reports/' + file.split('.')[0] + '.md';
    m().to(filename);
    filenames.push(file.split('.')[0] + '.md');
  });

var output = [ '# 分析報告\n' ];
filenames.forEach(function(r) {
  output.push('* [' + r + '](https://github.com/yurenju/fb-comments-fetcher/blob/gh-pages/reports/' + r + ')')
});

output.join('\n').to('comments/README.md');
