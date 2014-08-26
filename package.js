Package.describe({
  summary: "Transform your collections with helpers that you define",
  version: "0.3.2",
  git: "https://github.com/dburles/meteor-collection-helpers.git"
});

Package.onUse(function(api) {
  api.use(['underscore', 'mongo-livedata']);
  api.addFiles('collection-helpers.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('collection-helpers');
  api.addFiles('collection-helpers_tests.js');
});