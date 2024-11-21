import { assert } from 'chai';

import 'meteor/dburles:collection-helpers';

const meteorVersion = Meteor.release ? parseFloat(Meteor.release.split('@')[1]) : null;

if (meteorVersion && meteorVersion >= 3.0) {
  describe('Collection Helpers - Meteor 3.0+', function () {
    let Books, Authors;

    beforeEach(function () {
      Books = new Mongo.Collection('books');
      Authors = new Mongo.Collection('authors');
    });

    it('works', async function () {
      const author1 = await Authors.insertAsync({
        firstName: 'Charles',
        lastName: 'Darwin',
      });

      const author2 = await Authors.insertAsync({
        firstName: 'Carl',
        lastName: 'Sagan',
      });

      const book1 = await Books.insertAsync({
        authorId: author1,
        name: 'On the Origin of Species',
      });

      const book2 = await Books.insertAsync({
        authorId: author2,
        name: 'Contact',
      });

      Books.helpers({
        author: function () {
          return Authors.findOne(this.authorId);
        },

        authorAsync: async function () {
          return await Authors.findOneAsync(this.authorId);
        },
      });

      Books.helpers({
        foo: 'bar',
      });

      Authors.helpers({
        fullName: function () {
          return this.firstName + ' ' + this.lastName;
        },
        books: function () {
          return Books.find({ authorId: this._id }).fetch()
        },
        booksAsync: async function () {
          return await Books.find({ authorId: this._id }).fetchAsync();
        },
      });

      const book = await Books.findOneAsync(book1);

      const author = Meteor.isClient ? book.author() : (await book.authorAsync())
      assert.equal(author.firstName, 'Charles');
      assert.equal(author.fullName(), 'Charles Darwin');
      assert.equal(book.foo, 'bar');

      const authorCarl = await Authors.findOneAsync(author2);
      const booksByCarl = Meteor.isClient ? authorCarl.books() : (await authorCarl.booksAsync());
      console.error(booksByCarl)
      console.error(JSON.stringify(booksByCarl))
      assert.equal(booksByCarl.length, 1, 'books.count() should equal 1');
    });
  });
} else {
  describe('Collection Helpers - Meteor < 3.0', function () {
    let Books, Authors;

    beforeEach(function () {
      Books = new Mongo.Collection('books');
      Authors = new Mongo.Collection('authors');
    });

    it('should support sync helpers and methods', function () {
      const author1 = Authors.insert({
        firstName: 'Charles',
        lastName: 'Darwin',
      });

      const author2 = Authors.insert({
        firstName: 'Carl',
        lastName: 'Sagan',
      });

      const book1 = Books.insert({
        authorId: author1,
        name: 'On the Origin of Species',
      });

      const book2 = Books.insert({
        authorId: author2,
        name: 'Contact',
      });

      Books.helpers({
        author: function () {
          return Authors.findOne(this.authorId);
        },
      });

      Books.helpers({
        foo: 'bar',
      });

      Authors.helpers({
        fullName: function () {
          return this.firstName + ' ' + this.lastName;
        },
        books: function () {
          return Books.find({ authorId: this._id });
        },
      });

      const book = Books.findOne(book1);
      const author = book.author();

      assert.equal(author.firstName, 'Charles');
      assert.equal(book.foo, 'bar');

      const authorCarl = Authors.findOne(author2);
      const booksByCarl = authorCarl.books();
      assert.equal(booksByCarl.count(), 1, 'books.count() should equal 1');
    });
  });
}

describe('Collection Helpers - Errors', function () {
  it('should throw an error if transform function already exists', function () {
    const Poet = function (doc) {
      return _.extend(this, doc);
    };

    Poet.prototype.fullName = 'Emily Dickinson';

    const Poets = new Mongo.Collection('poets', {
      transform: function (doc) {
        return new Poet(doc);
      },
    });

    assert.throws(() => {
      Poets.helpers({
        fullName: function () {
          return this.firstName + ' ' + this.lastName;
        },
      });
    });
  });
});
