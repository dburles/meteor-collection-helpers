Mongo.Collection.prototype.helpers = function (helpers) {
    var self = this;

    if (self._transform && !self._helpers)
        throw new Meteor.Error("Can't apply helpers to '" +
          self._name + "' a transform function already exists!");

    if (!self._helpers) {
        self._helpers = function Document(doc) {
            _.extend(this, doc);
            self._helpers._nest(this, self._helpers._nestedHelperTree, this);
            return this;
        };
        self._helpers._nest = function (root, tree, currentLevel, parentLevel) {
            for (var node in tree) {
                if (typeof tree[node] === "function") {
                    // we expect tree leaves to be helper functions
                    currentLevel[node] = _.partial(tree[node], {
                        nestedHelperContext: {
                            parentDocument: parentLevel,
                            rootDocument: root
                        }
                    });
                } else {
                    if (!currentLevel[node]) {
                        // Property does not exist on this document. Ignore
                        continue;
                    }
                    if (node.indexOf("$") !== -1) {
                        throw new Error("$ must be preceded by an array");
                    }
                    if (tree[node].$) {
                        for (var i = 0; i < currentLevel[node].length; i++) {
                            self._helpers._nest(root, tree[node].$, currentLevel[node][i], currentLevel);
                        }
                    } else {
                        self._helpers._nest(root, tree[node], currentLevel[node], currentLevel);
                    }
                }
            }
        };
        self._transform = function (doc) {
            return new self._helpers(doc);
        };
    }

    _.each(helpers, function (helper, key) {
        var path = key.split(".");
        if (path.length === 1) {
            // key is root
            if (self._helpers.prototype[key]) {
                throw new Error("Cannot add helper at" + key + ". Helpers cannot override existing properties");
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
                        throw new Error("Cannot add helper at" + key + ". Helper already defined");
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
