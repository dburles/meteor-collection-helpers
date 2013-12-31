# Meteor Collection Helpers

Add helpers to your collections, just like Templates!

### Usage

A basic example

```javascript
Books = new Meteor.Collection('books');
Authors = new Meteor.Collection('authors');

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
```

### Credits

Thanks to Mathieu Bouchard's work on [collection-hooks](https://github.com/matb33/meteor-collection-hooks) which assisted a great deal with extending Meteor.Collection.
