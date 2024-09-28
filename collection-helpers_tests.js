const meteorVersion = Meteor.release ? parseFloat(Meteor.release.split('@')[1]) : null;

if (meteorVersion && meteorVersion >= 3.0) {
  Tinytest.add("works", async function (test) {
    Books = new Mongo.Collection('books' + test.id);
    Authors = new Mongo.Collection('authors' + test.id);

    var author1 = await Authors.insertAsync({
      firstName: 'Charles',
      lastName: 'Darwin'
    });

    var author2 = await Authors.insertAsync({
      firstName: 'Carl',
      lastName: 'Sagan'
    });

    var book1 = await Books.insertAsync({
      authorId: author1,
      name: 'On the Origin of Species'
    });

    var book2 = await Books.insertAsync({
      authorId: author2,
      name: 'Contact'
    });

    Books.helpers({
      author: function () {
        // TODO: Support async helpers?
        //return Authors.findOne(this.authorId);
      }
    });

    // We should be able to apply more if we wish
    Books.helpers({
      foo: 'bar'
    });

    Authors.helpers({
      fullName: function () {
        return this.firstName + ' ' + this.lastName;
      },
      books: function () {
        return Books.find({ authorId: this._id });
      }
    });

    var book = await Books.findOneAsync(book1);
    var author = book.author();
    test.equal(author.firstName, 'Charles');
    test.equal(book.foo, 'bar');

    book = await Books.findOneAsync(book2);
    author = book.author();
    test.equal(author.fullName(), 'Carl Sagan');

    author = await Authors.findOneAsync(author1);
    books = author.books();
    test.equal(books.count(), 1);
  });
} else {
  // Meteor < 3.0
  Tinytest.add("works", function (test) {
    Books = new Mongo.Collection('books' + test.id);
    Authors = new Mongo.Collection('authors' + test.id);

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
      author: function () {
        return Authors.findOne(this.authorId);
      }
    });

    // We should be able to apply more if we wish
    Books.helpers({
      foo: 'bar'
    });

    Authors.helpers({
      fullName: function () {
        return this.firstName + ' ' + this.lastName;
      },
      books: function () {
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
    books = author.books();
    test.equal(books.count(), 1);
  });
}

Tinytest.add("throw error if transform function already exists", function(test) {
  Author = function(doc) { return _.extend(this, doc); };

  Author.prototype.fullName = 'Charles Darwin';

  Authors = new Meteor.Collection('authors' + test.id, {
    transform: function(doc) { return new Author(doc); }});

  test.throws(function() {
    Authors.helpers({
      fullName: function() {
        return this.firstName + ' ' + this.lastName;
      }
    });
  });
});