Package.describe({
  name: "stfnbrgh:collection-nested-helpers",
  summary: "Transform your collections with helpers that you define",
  version: "0.0.1",
  git: "https://github.com/stfnbrgh/meteor-nested-collection-helpers.git"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use([
    'underscore',
    'mongo']);
  
  api.addFiles('collection-helpers.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('dburles:collection-helpers');
  api.addFiles('collection-helpers_tests.js');
});