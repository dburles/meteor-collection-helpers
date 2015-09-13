Mongo.Collection.prototype.helpers = function(helpers) {
  var self = this;

  if (! self._helpers) {
    self._helpers = function Document(doc) { return _.extend(this, doc); };
    orig_transform = self._transform ? self._transform : function(doc) {return doc; }
    self._transform = function(doc) {
      return new self._helpers(orig_transform(doc));
    };
  }

  _.each(helpers, function(helper, key) {
    self._helpers.prototype[key] = helper;
  });
};
