Package.describe({
  summary: 'Collection helpers'
});

Package.on_use(function(api) {
  api.use(['underscore']);
  api.add_files('collection-helpers.js', ['client', 'server']);
});

Package.on_test(function (api) {
	api.use([
		'coffeescript',
		'tinytest',
		'test-helpers',
	],
	['client', 'server']
	);
	api.add_files(['collection-helpers-test.coffee'], ['server'] )
});
