# Meteor Collection Helpers

Collection helpers automatically sets up a transformation on your collections using Meteor's Mongo.Collection `transform` option, allowing for simple models with an interface that's similar to template helpers.

## Installation

```sh
meteor add dburles:collection-helpers
```

## Usage

Write your helpers somewhere seen by both client and server.

```javascript
const Books = new Mongo.Collection('books');
const Authors = new Mongo.Collection('authors');

Books.helpers({
  author() {
    return Authors.findOne(this.authorId); // Client only (Meteor 3+)
  },
  authorAsync() {
    return Authors.findOneAsync(this.authorId);
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
const book = await Books.findOneAsync();
const author = await book.authorAsync();
author.firstName; // Charles
author.fullName(); // Charles Darwin
```

and:

```javascript
const author = await Authors.findOneAsync();
await author.books().fetchAsync();
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

### Meteor.users

You can also apply helpers to the Meteor.users collection

```javascript
Meteor.users.helpers({
  // ...
});
```

### Applying the transformation function

Sometimes it may be useful to apply the transformation directly to an object.

```js
const doc = {
  firstName: 'Charles',
  lastName: 'Darwin'
};

const transformedDoc = Authors._transform(doc);

transformedDoc.fullName(); // Charles Darwin
```

### Testing

```sh
meteor test-packages ./
```

### License

MIT
