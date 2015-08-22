require('shelljs/global');

var DIR = 'comments'

rm('-rm', DIR);

exec('git clone "https://' + env.GH_TOKEN +
     '@' + env.GH_REF_FB + '" --depth 1 -b gh-pages ' + DIR);
cd(DIR);
exec('git config user.name "Automatic Commit"');
exec('git config user.email "fb-comments-fetcher@g0v.tw"');
exec('git add .');
exec('git commit -m "Automatic commit: ' + Date() + '"');
exec('git push "https://' + env.GH_TOKEN +
     '@' + env.GH_REF_FB + '" gh-pages', {silent: true});
