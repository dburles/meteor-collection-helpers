#Needs Update
# Meteor Collection Helpers

Collection helpers automatically sets up a transformation on your collections using Meteor's Mongo.Collection `transform` option, allowing for simple models, with an interface similar to template helpers.

## Installation

There is not currently a package with this functionality. Just clone into your packages folder and do 
```sh
$ meteor add dburles:collection-helpers
```
This package is not currently compatible with dburles:collection-helpers and is offered as an alternative. It is also quite new so stuff like the fact that it still has the same name etc. will be sorted out as time allows.

## Usage - TODO: Better examples

It's recommended to set up helpers to run on both server and client. This way your helpers can be accessed both server side and client side. 

###Pre-requisites
_Define some collections._

```javascript
Books = new Mongo.Collection('books');
Authors = new Mongo.Collection('authors');

// A book document looks like:
// {
//     name: "A book written for me",
// 	   authorId: "xsdafdawd...",
// 	   publisher: "Pubs united",
// 	   foreword: {
// 		   author: "Foreword Author"
// 		   title: "Foreword"
// 		   paragraphs: [ ... ] /*strings*/,		
// 	   },
// 	   chapters: [
//	       { title: "...", pages: [ ... ] /*strings*/ }
//	   ]
// }
```

###Basic Helpers
Attaches helpers to the root document(s) returned from a collection.

```javascript
Books.helpers({
  author: function() {
    return Authors.findOne(this.authorId);
  },
  remove: function(){
	Books.remove({_id: this._id});
  }
});
// bookInstance.remove() // remove this book from the Books collection
// bookInstance.author().firstName 
```

###Nested Helpers

```javascript
Books.helpers({
	"foreword.numberOfParagraphs": function(helperContext){
		//helperContext -> { parentDocument: { ... }, rootDocument: { ... } }
		//this -> { author: "...", title: "...", paragraphs: [...] }	
		
		return this.paragraphs ? this.paragraphs.length : 0;
	}
});
// var n = bookInstance.foreword.numberOfParagraphs() // number of paragraphs in foreword
```

###Array Nested Helpers

```javascript
Books.helpers({
	"chapters.$.numberOfPages": function(helperContext){
		//helperContext -> { parentDocument: { ... }, rootDocument: { ... } }
		//this -> { title: "...", pages: [ ... ] }	
		
		return this.pages ? this.pages.length : 0;
	}
});
// bookInstance.chapters[2].numberOfPages(); // number of pages in chapter three
// bookInstance.chapters[5].numberOfPages(); // number of pages in chapter six
```

### Example use within a template

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
// TODO: test this to make sure it works
<template name="books">
  <ul>
  {{#each books}}
    <li>
	<p>{{name}} by {{author.fullName}}</p>
	<ul>
		{{ #each chapters }}
		<li>{{ title }}: {{ numberOfPages }}</li>
		{{ /each }}
	</ul>	
	</li>
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

transformedDoc = Authors._transform(doc);

transformedDoc.fullName(); // Charles Darwin
```

### License

MIT
