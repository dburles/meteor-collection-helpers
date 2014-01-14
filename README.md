# Meteor Collection Helpers

Collection helpers automatically sets up a transformation on your collections allowing for simple models, with an interface similar to template helpers.

### Usage

Set up some helpers

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

#### Example use within a template

Our relationships are resolved by the collection helper, avoiding unnecessary template helpers. So we can simply write:

```javascript
Template.books.helpers({
  books: function() {
    return Books.find();
  }
});
```

...with the corresponding template:

```html
<template name="books">
  <ul>
  {{#each books}}
    <li>{{name}} by {{author.fullName}}</li>
  {{/each}}
  </ul>
</template>
```

#### Use outside of templates

You can of course access helpers outside of your templates:

```javascript
Books.findOne().author().firstName; // Charles
Books.findOne().author().fullName(); // Charles Darwin
```

### Meteor.users

You can also apply helpers to the Meteor.users collection

```javascript
Meteor.users.helpers({
  // ...
});
```

### Credits

Thanks to [Tom Coleman](https://github.com/tmeasday/) for the idea on the refactor and [Mathieu Bouchard's](https://github.com/matb33/) method to extend Meteor.Collection (used in collection-helpers pre 0.2.0)


