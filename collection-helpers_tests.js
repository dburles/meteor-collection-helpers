const meteorVersion = Meteor.release
  ? parseFloat(Meteor.release.split("@")[1])
  : null;

if (meteorVersion && meteorVersion >= 3) {
  Tinytest.addAsync("works", async function (test, onComplete) {
    const Books = new Mongo.Collection(
      Meteor.isClient ? null : "books" + test.id
    );
    const Authors = new Mongo.Collection(
      Meteor.isClient ? null : "authors" + test.id
    );

    const author1 = await Authors.insertAsync({
      firstName: "Charles",
      lastName: "Darwin",
    });

    const author2 = await Authors.insertAsync({
      firstName: "Carl",
      lastName: "Sagan",
    });

    const book1 = await Books.insertAsync({
      authorId: author1,
      name: "On the Origin of Species",
    });

    const book2 = await Books.insertAsync({
      authorId: author2,
      name: "Contact",
    });

    Books.helpers({
      author() {
        return Authors.findOneAsync(this.authorId);
      },
    });

    // We should be able to apply more if we wish
    Books.helpers({
      foo: "bar",
    });

    Authors.helpers({
      fullName() {
        return this.firstName + " " + this.lastName;
      },
      books() {
        return Books.find({ authorId: this._id });
      },
    });

    const book = await Books.findOneAsync(book1);
    const author = await book.author();

    test.equal(author.firstName, "Charles");
    test.equal(author.fullName(), "Charles Darwin");
    test.equal(book.foo, "bar");

    const authorCarl = await Authors.findOneAsync(author2);
    const booksByCarl = await authorCarl.books().fetchAsync();

    test.equal(booksByCarl.length, 1);

    onComplete();
  });
} else {
  // Meteor < 3.0
  Tinytest.add("works", function (test) {
    const Books = new Mongo.Collection("books" + test.id);
    const Authors = new Mongo.Collection("authors" + test.id);

    const author1 = Authors.insert({
      firstName: "Charles",
      lastName: "Darwin",
    });

    const author2 = Authors.insert({
      firstName: "Carl",
      lastName: "Sagan",
    });

    const book1 = Books.insert({
      authorId: author1,
      name: "On the Origin of Species",
    });

    const book2 = Books.insert({
      authorId: author2,
      name: "Contact",
    });

    Books.helpers({
      author: function () {
        return Authors.findOne(this.authorId);
      },
    });

    // We should be able to apply more if we wish
    Books.helpers({
      foo: "bar",
    });

    Authors.helpers({
      fullName: function () {
        return this.firstName + " " + this.lastName;
      },
      books: function () {
        return Books.find({ authorId: this._id });
      },
    });

    const book = Books.findOne(book1);
    const author = book.author();
    test.equal(author.firstName, "Charles");
    test.equal(book.foo, "bar");

    const authorCarl = Authors.findOne(author1);
    const booksByCarl = author.books();
    test.equal(booksByCarl.count(), 1);
  });
}

Tinytest.add(
  "throw error if transform function already exists",
  function (test) {
    Author = function (doc) {
      return _.extend(this, doc);
    };

    Author.prototype.fullName = "Charles Darwin";

    Authors = new Meteor.Collection("authors" + test.id, {
      transform: function (doc) {
        return new Author(doc);
      },
    });

    test.throws(function () {
      Authors.helpers({
        fullName: function () {
          return this.firstName + " " + this.lastName;
        },
      });
    });
  }
);
