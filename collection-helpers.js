var constructor = Meteor.Collection;
var Document = {};

Meteor.Collection = function(name, options) {
  if (typeof options === 'undefined')
    options = {};

  Document[name] = function(doc) { return _.extend(this, doc); };
  options.transform = function(doc) { return new Document[name](doc); };

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

if (typeof Meteor.users !== 'undefined') {
  var User = function(doc) { return _.extend(this, doc); };
  Meteor.users._transform = function(doc) { return new User(doc); };
  Meteor.users.helpers = function(helpers) {
    _.each(helpers, function(helper, key) {
      User.prototype[key] = helper;
    });
  };
}