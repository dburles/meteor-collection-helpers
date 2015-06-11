Tinytest.add("works", function(test) {
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
    name: 'On the Origin of Species',
    chapters: [
      {
          pages: ["page1"]
      },
      {
          pages: ["page1", "page2"]
      },
      {
          pages: ["page1", "page2", "page3"]
      }
    ],
    arrayWithComplexObjects: [
      { nest: { helper: { insideArrays: { number: 1 } } } },
      { nest: { helper: { insideArrays: { number: 2 } } } }
    ],
    nested: { property: { on: { book: { number: 54321 } } } }
  });

  var book2 = Books.insert({
    authorId: author2,
    name: 'Contact',
    chapters: [],
    arrayWithComplexObjects: [],
    nested: { property: { on: { book: { number: 2 } } } }
  });

  Books.helpers({
      author: function () {
          return Authors.findOne(this.authorId);
      }
  });

  Books.helpers({
      "nested.property.on.book.getNumber": function () {
          return this.number;
      },
      "chapters.$.numberOfPages": function () {
          return this.pages.length;
      },
      "arrayWithComplexObjects.$.nest.helper.insideArrays.getNumber": function () {
          return this.number;
      },
      "arrayWithComplexObjects.$.nest.helper.getNext": function () {
          return this;
      }
  });

  Books.helpers({
      "nested.property.on.book.getNumber": function () {
          return this.number;
      },
      "chapters.$.numberOfPages": function () {
          return this.pages.length;
      },
      "arrayWithComplexObjects.$.nest.helper.insideArrays.getNumber": function () {
          return this.number;
      },
      "arrayWithComplexObjects.$.nest.helper.getNext": function () {
          return this;
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
  books = author.books();
  test.equal(books.count(), 1);

  // test nested helpers
  book = Books.findOne(book1);
  test.equal(book.nested.property.on.book.getNumber(), 54321);
  test.equal(book.chapters[1].numberOfPages(), 2);
  test.equal(book.arrayWithComplexObjects[0].nest.helper.insideArrays.getNumber(), 1);
  test.equal(book.arrayWithComplexObjects[0].nest.helper.getNext().insideArrays.number, 1);
});

Tinytest.add("throw error if transform function already exists", function (test) {
    Author = function (doc) { return _.extend(this, doc); };

    Author.prototype.fullName = 'Charles Darwin';

    Authors = new Meteor.Collection('authors' + test.id, {
        transform: function (doc) { return new Author(doc); }
    });

    test.throws(function () {
        Authors.helpers({
            fullName: function () {
                return this.firstName + ' ' + this.lastName;
            }
        });
    });
});
