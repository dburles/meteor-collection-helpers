Package.describe({
  summary: "Transform your collections with helpers that you define",
  version: "1.0.0",
  git: "https://github.com/dburles/meteor-collection-helpers.git"
});

Package.onUse(function(api) {
  api.use([
    'underscore@1.0.0',
    'mongo-livedata@1.0.3']);
  
  api.addFiles('collection-helpers.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('dburles:collection-helpers');
  api.addFiles('collection-helpers_tests.js');
});