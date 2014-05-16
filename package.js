Package.describe({
  summary: 'Collection helpers'
});

Package.on_use(function(api) {
  api.use('underscore');
  api.add_files('collection-helpers.js');
});

Package.on_test(function(api) {
  api.use('tinytest');
  api.use('collection-helpers');
  api.add_files('collection-helpers_tests.js');
});