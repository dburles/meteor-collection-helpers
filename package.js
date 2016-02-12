Package.describe({
    name: "ephemer:collection-helpers",
    summary: "Transform Collections with self-defined helpers. Works with TAPi18n & other self-defined transforms!",
    version: "1.1.0",
    documentation: "README.md",
    git: "https://github.com/ephemer/meteor-collection-helpers.git",
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.0.2');
    api.use([
        'ecmascript',
        'underscore',
        'mongo']);

    api.addFiles('collection-helpers.js');
});

Package.onTest(function(api) {
    api.use([
        'ecmascript',
        'tinytest',
        'underscore',
        'mongo',
        'ephemer:collection-helpers']);
    api.addFiles('collection-helpers_tests.js');
});
