Mongo.Collection.prototype.helpers = function(helpers) {
    let self = this;

    if (!self._helpers) {
        let OriginalDocument = class OriginalDocument {};

        if (self._transform) {
            let transformedDoc = createDummyTransformedDocument.call(self);
            OriginalDocument = transformedDoc.__proto__.constructor;
            if (OriginalDocument === Object) {
                OriginalDocument = self._transform;
            }
        }

        self._helpers = class DocumentWithHelpers extends OriginalDocument {
            constructor(doc) {
                super(doc);
                return _.extend(this, doc);
            }
        }

        self._transform = function(doc) {
            return new self._helpers(doc);
        };
    }

    let transformedDoc = createDummyTransformedDocument.call(self);
    _.each(helpers, function(helper, key) {
        if (transformedDoc[key] === undefined) {
            self._helpers.prototype[key] = helper;
        } else {
            throw new Meteor.Error(`A helper called ${key} already exists on ${self}`)
        }
    });
};


function createDummyTransformedDocument() {
    try {
        return this._transform({_id: 'fakeDocument'});
    } catch(e) {
        throw new Meteor.Error(`Error while adding helpers to your Collection`,
            `This only happens when your Collection has an existing transform
             that accesses non-initialised state internally and then you try to
             add helpers via Collection.helpers({}).`)
    }
}
