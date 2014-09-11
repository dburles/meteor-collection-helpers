var Document = {};
Mongo.Collection.prototype.helpers = function(helpers) {
  var self = this;
  if (! Document[self._name]) Document[self._name] = function(doc) { return _.extend(this, doc); };
  if (! self._transform) self._transform = function(doc) { return new Document[self._name](doc); };
  _.each(helpers, function(helper, key) {
    Document[self._name].prototype[key] = helper;
  });
};
