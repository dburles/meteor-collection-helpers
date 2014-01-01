Package.describe({
  summary: 'Collection helpers'
});

Package.on_use(function(api) {
  api.add_files('collection-helpers.js', ['client', 'server']);  
});
