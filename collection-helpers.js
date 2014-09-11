var Document = {};
Mongo.Collection.prototype.helpers = function(helpers) {
  var self = this;

  if (self._transform && ! self._hasCollectionHelpers)
    throw new Meteor.Error("Can't apply helpers to '" +
      self._name + "' a transform function already exists!");

  if (! self._hasCollectionHelpers) {
    Document[self._name] = function(doc) { return _.extend(this, doc); };
    self._transform = function(doc) { return new Document[self._name](doc); };
    self._hasCollectionHelpers = true;
  }
  
  _.each(helpers, function(helper, key) {
    Document[self._name].prototype[key] = helper;
  });
};
