var constructor = Meteor.Collection;

Meteor.Collection = function(name, options) {
  if (typeof options === 'undefined')
    options = {};
  options.transform = function(doc) { return new Document(doc); };
  return constructor.call(this, name, options);
};

Document = function(doc) { return _.extend(this, doc); };

Meteor.Collection.prototype = Object.create(constructor.prototype);
Meteor.Collection.prototype.helpers = function(helpers) {
  _.each(helpers, function(helper, key) {
    Document.prototype[key] = helper;
  });
};

for (var func in constructor) {
  if (constructor.hasOwnProperty(func)) {
    Meteor.Collection[func] = constructor[func];
  }
}
