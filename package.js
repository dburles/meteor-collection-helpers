Package.describe({
  name: "dburles:collection-helpers",
  summary: "Transform your collections with helpers that you define",
  version: "2.0.0",
  documentation: "README.md",
  git: "https://github.com/dburles/meteor-collection-helpers.git",
});

Package.onUse(function(api) {
  api.versionsFrom(['2.3', '3.0']);
  api.use(['mongo']);

  api.addFiles('collection-helpers.js');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'mongo',
    'dburles:collection-helpers']);

  api.addFiles('collection-helpers_tests.js');
});
