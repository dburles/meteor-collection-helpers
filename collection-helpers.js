var Document = {};
Meteor.Collection.prototype.helpers = function(helpers) {
  var self = this;
  if (! Document[self._name]) Document[self._name] = function(doc) { return _.extend(this, doc); };
  _.each(helpers, function(helper, key) {
    Document[self._name].prototype[key] = helper;
  });
  if (! self._transform) this._transform = function(doc) { return new Document[self._name](doc); };
};
