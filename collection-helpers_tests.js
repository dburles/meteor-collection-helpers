'use strict';

Tinytest.add("Works as expected in base case", function(test) {
    var Books = new Mongo.Collection(null);
    var Authors = new Mongo.Collection(null);

    var author1 = Authors.insert({
        firstName: 'Charles',
        lastName: 'Darwin'
    });

    var author2 = Authors.insert({
        firstName: 'Carl',
        lastName: 'Sagan'
    });

    var book1 = Books.insert({
        authorId: author1,
        name: 'On the Origin of Species'
    });

    var book2 = Books.insert({
        authorId: author2,
        name: 'Contact'
    });

    Books.helpers({
        author: function() {
            return Authors.findOne(this.authorId);
        }
    });

    // We should be able to apply more if we wish
    Books.helpers({
        foo: 'bar'
    });

    Authors.helpers({
        fullName: function() {
            return this.firstName + ' ' + this.lastName;
        },
        books: function() {
            return Books.find({ authorId: this._id });
        }
    });

    var book = Books.findOne(book1);
    var author = book.author();

    test.equal(author.firstName, 'Charles');
    test.equal(book.foo, 'bar');

    book = Books.findOne(book2);
    author = book.author();
    test.equal(author.fullName(), 'Carl Sagan');

    author = Authors.findOne(author1);
    var books = author.books();
    test.equal(books.count(), 1);
});

Tinytest.add("Throw error if transform function already exists", function(test) {
    class Author {
        constructor(doc) {
            return _.extend(this, doc);
        }

        fullName() {
            return 'Charles Darwin';
        }
    }

    var Authors = new Meteor.Collection(null, {
        transform(doc) {
            return new Author(doc);
        }
    });

    test.throws(function() {
        Authors.helpers({
            fullName() {
                return this.firstName + ' ' + this.lastName;
            }
        });
    });
});

Tinytest.add("Work normally if non-conflicting transform function already exists", function(test) {
    class Author {
        constructor(doc) {
            return _.extend(this, doc);
        }

        aSmartMan() {
            return 'Charles Darwin';
        }
    }

    var Authors = new Meteor.Collection(null, {
        transform(doc) {
            return new Author(doc);
        }
    });

    Authors.helpers({
        fullName() {
            return this.firstName + ' ' + this.lastName;
        }
    });

    Authors.insert({
        firstName: 'Charles',
        lastName: 'Darwin'
    });

    let author = Authors.findOne();
    test.equal(author.fullName(), author.aSmartMan());
});


Tinytest.add("Use a normal transform too without breaking things", function(test) {
    var Authors = new Meteor.Collection(null, {
        transform(doc) {
            doc.normalTransform = 'working';
            return doc;
        }
    });

    Authors.helpers({
        fullName() {
            return this.firstName + ' ' + this.lastName;
        }
    });

    Authors.insert({
        firstName: 'Bob',
        lastName: 'Dole'
    });

    let bob = Authors.findOne();

    test.equal(bob.firstName, 'Bob');
    test.equal(bob.lastName, 'Dole');
    test.equal(bob.fullName(), 'Bob Dole');
    test.equal(bob.normalTransform, 'working');

    test.throws(function() {
        Authors.helpers({
            normalTransform() {
                return "This should fail";
            }
        });
    });

    test.equal(bob.normalTransform, 'working');
});
