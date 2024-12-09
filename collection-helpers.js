Mongo.Collection.prototype.helpers = function(helpers) {
  if (this._transform && !this._helpers)
    throw new Meteor.Error("Can't apply helpers to '" +
      this._name + "' a transform function already exists!");

  if (!this._helpers) {
    this._helpers = function Document(doc) { return Object.assign(this, doc); };
    this._transform = doc => new this._helpers(doc);
  }

  Object.keys(helpers).forEach(key => (this._helpers.prototype[key] = helpers[key]));
};
