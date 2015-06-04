Mongo.Collection.prototype.helpers = function(helpers) {
  var self = this;

  if (self._transform && ! self._helpers)
    throw new Meteor.Error("Can't apply helpers to '" +
      self._name + "' a transform function already exists!");

  if (! self._helpers) {
      self._helpers = function Document(doc) {
          console.log(this);
      };
    self._transform = function(doc) {
      return new self._helpers(doc);
    };
  }

  _.each(helpers, function (helper, key) {
      var path = key.split(".");
      if (path.length === 1) {
          // key is root
          if (self._helpers.prototype[key]) {
              console.error("Cannot add helper at" + key + ". Helpers cannot override existing properties");
              return;
          }
          self._helpers.prototype[key] = helper;
          return;
      } else {
          // key is nested
          self._helpers._nestedHelperTree = self._helpers._nestedHelperTree || {};
          var tree = self._helpers._nestedHelperTree;
          for (var i = 0; i < path.length; i++) {
              if (i === path.length - 1) {
                  if (tree[path[i]]) {
                      console.error("Cannot add helper at" + key + ". Helper already defined");
                      return;
                  } else {
                      tree[path[i]] = helper;
                  }
              } else {
                  if (!tree[path[i]]) {
                      tree[path[i]] = {};
                  }
                  tree = tree[path[i]];
              }
          }
      }
  });
};
