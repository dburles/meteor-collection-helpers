Package.describe({
  name: "dburles:collection-helpers",
  summary: "Transform your collections with helpers that you define",
  version: "1.0.1",
  git: "https://github.com/dburles/meteor-collection-helpers.git"
});

Package.onUse(function(api) {
  api.use([
    'underscore@1.0.1',
    'mongo@1.0.7']);
  
  api.addFiles('collection-helpers.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('dburles:collection-helpers');
  api.addFiles('collection-helpers_tests.js');
});