# Meteor Collection Helpers

Add helpers to your collections, just like templates.

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

Relationships are then resolved by the collection helper, avoiding unnecessary template helpers. So we can simply write:

```javascript
Template.books.helpers({
  books: function() {
    return Books.find();
  }
});
```

..with the corresponding template:

```html
<template name="books">
  <ul>
  {{#each books}}
    <li>{{name}} by {{author.fullName}}</li>
  {{/each}}
  </ul>
</template>
```

You can also apply helpers to users

```javascript
Meteor.users.helpers({
  ...
});
```

### Credits

Thanks to Mathieu Bouchard's work on [collection-hooks](https://github.com/matb33/meteor-collection-hooks) which assisted a great deal with extending Meteor.Collection.
