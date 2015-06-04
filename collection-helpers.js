Mongo.Collection.prototype.helpers = function(helpers) {
  var self = this;

  if (self._transform && ! self._helpers)
    throw new Meteor.Error("Can't apply helpers to '" +
      self._name + "' a transform function already exists!");

  if (! self._helpers) {
      self._helpers = function Document(doc) {
          _.extend(this, doc);
          self._helpers._nest(self._helpers._nestedHelperTree, this);
          return this;
      };
      self._helpers._nest = function (tree, currentLevel) {
          for (var node in tree) {
              if (typeof tree[node] === "function") {
                  // we expect tree leaves to be helper functions
                  currentLevel[node] = tree[node];
              } else {
                  if (!currentLevel[node]) {
                      console.error("Cannot navigate past node " + node + " it does not exist.");
                      return;
                  }
                  if (!tree[node].$ && !currentLevel[node]) {
                      console.error(["Property " + node + " does not exist.", tree, currentLevel]);
                      return;
                  }
                  if (node.indexOf("$") !== -1) {
                      console.error("$ must be preceded by an array");
                      return;
                  }
                  if (tree[node].$) {
                      for (var i = 0; i < currentLevel[node].length; i++) {
                          self._helpers._nest(tree[node].$, currentLevel[node][i]);
                      }
                  } else {
                      self._helpers._nest(tree[node], currentLevel[node]);
                  }
              }
           }
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
