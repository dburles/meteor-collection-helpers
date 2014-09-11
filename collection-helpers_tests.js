Tinytest.add("collection-helpers - works", function(test) {
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
    author: function() {
      return Authors.findOne(this.authorId);
    }
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

  book = Books.findOne(book2);
  author = book.author();
  test.equal(author.fullName(), 'Carl Sagan');

  author = Authors.findOne(author1);
  books = author.books();
  test.equal(books.count(), 1);
});