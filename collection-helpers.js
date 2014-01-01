var constructor = Meteor.Collection;
var Document = {};

Meteor.Collection = function(name, options) {
  var self = this;
  if (typeof options === 'undefined')
    options = {};

  self._name = name;
  Document[self._name] = function(doc) { return _.extend(this, doc); };
  
  options.transform = function(doc) { return new Document[self._name](doc); };
  return constructor.call(this, name, options);
};

Meteor.Collection.prototype = Object.create(constructor.prototype);
Meteor.Collection.prototype.helpers = function(helpers) {
  var self = this;
  _.each(helpers, function(helper, key) {
    Document[self._name].prototype[key] = helper;
  });
};

for (var func in constructor) {
  if (constructor.hasOwnProperty(func)) {
    Meteor.Collection[func] = constructor[func];
  }
}
