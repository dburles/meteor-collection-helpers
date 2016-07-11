# Meteor Collection Helpers

Collection helpers automatically sets up a transformation on your collections using Meteor's Mongo.Collection `transform` option, allowing for simple models with an interface that's similar to template helpers.

## Installation

```sh
$ meteor add ephemer:collection-helpers
```

## Usage

Write your helpers somewhere seen by both client and server.

```javascript
Books = new Mongo.Collection('books');
Authors = new Mongo.Collection('authors');

Books.helpers({
  author() {
    return Authors.findOne(this.authorId);
  }
});

Authors.helpers({
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  books() {
    return Books.find({ authorId: this._id });
  }
});
```

This will then allow you to do:

```javascript
Books.findOne().author().firstName; // Charles
Books.findOne().author().fullName(); // Charles Darwin
Authors.findOne().books()
```

Our relationships are resolved by the collection helper, avoiding unnecessary template helpers. So we can simply write:

```javascript
Template.books.helpers({
  books() {
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

## Meteor.users

You can also apply helpers to the Meteor.users collection

```javascript
Meteor.users.helpers({
  // ...
});
```

### Applying the transformation function

Sometimes it may be useful to apply the transformation directly to an object.

```js
var doc = {
  firstName: 'Charles',
  lastName: 'Darwin'
};

var transformedDoc = Authors._transform(doc);

transformedDoc.fullName(); // Charles Darwin
```

### License

MIT
