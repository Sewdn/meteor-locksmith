Package.describe({
  name: 'sewdn:locksmith',
  version: '0.0.1',
  summary: 'Lock a function over several app instances or builds',
  git: "https://github.com/Sewdn/meteor-locksmith.git"
});

Package.onUse(function(api) {
  
  api.versionsFrom('1.2.1');

  api.use([
    'mongo',
    'random',
    'underscore'
  ], 'server');

  api.addFiles([
    'locks.js'
  ], 'server');

  api.export('LockSmith');

});
