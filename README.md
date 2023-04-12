# @fohletex/forerunnerdb-debugger

This is a tiny debugger that allows you to quickly check the contents stored in a [ForerunnerDB](https://github.com/Irrelon/ForerunnerDB).

## How to setup

`yarn add @fohletex/forerunnerdb-debugger`

or resp.

`yarn add --save-dev @fohletex/forerunnerdb-debugger`

if you just want to use it for internal dev purposes (e.g. doing some data checks during a unit test).

## How to use it

> :warning: **WARNING**
> For the next steps I assume you've already setup a valid forerunner db instance and are familiar with the common handling of the ForerunnerDb library. If not, I advise you to go through their documentation carefully. It is worth to read.
> If you want to skip that for now I advise you to just have [setup the forerunner instance](https://github.com/Irrelon/ForerunnerDB#use-forerunnerdb-in-nodejs) itself and [initialized an appropriate database](https://github.com/Irrelon/ForerunnerDB#create-a-database).

First of all you need to establish the debugger and connect it with your ForerunnerDB instance, that you've already setup (see yellow box above for more information on how to setup the forerunner instance).

```js
const fdbgr = new ForerunnerDbDebugger(db); /* db: you're forerunner db object */
```

At current the debugger contains three functionalities that were very helpful for me to get a quick overview during runtime or checking my production systems in the frontend when I doubt that not all data was given to my backend. This

1. list collection names
2. quickly listing the data
3. print all data

### List Collection Names

The collection names are accessible via a general object property `collectionNames`. 

```js
const { collectionNames } = fdbgr;
```

Will return a list of strings representing the collection names.

### List all data

```js
const allData = fdbgr.toJSON();
```

Will return an object which contains as keys the names of all collections currently known to the database and as appropriate values a list of all data entries in the appropriate collections. The indexes of the data entries are the same as stored in the database!

Example Output:

```js
const coll = db.collection('test');
coll.insert([{ fruit: 'apple' }, { fruit: 'banana' }]);

console.log(fdbgr.toJSON());

/**
 * Will output somthing like:
 * 
 * { test: [ { _id: 'e89jiljjf', fruit: 'apple' }, { _id: 'b8sfj9u8', fruit: 'banana' } ] }
 */
```

### Print data in readable format

Especially when the database contains more data than usual, it might be good to watch the data in a more human-readable format to quicker detect content issues, therefore you may want to use this method:

```js
fdbgr.prettyPrint();

/**
 * Will output something like:
 * 
 * =====================================================
 * = test
 * =====================================================
 * 0 | { _id: 'e89jiljjf', fruit: 'apple' }
 * 1 | { _id: 'b8sfj9u8', fruit: 'banana' } 
 */
```

### But, what if I have a very large database?

If you have a lot of data stored in your forerunner database you probably may not want to print the whole contents. Therefore you may set a filter limit, as in the following example. Note, this output will limit all collections connected to the database, no matter how many entries they have.

```js
fdbgr.prettyPrint(1);

/**
 * Will output something like:
 * 
 * =====================================================
 * = test
 * =====================================================
 * 0 | { _id: 'e89jiljjf', fruit: 'apple' } 
 */
```

And yes! Of course this filter option is also available for the `toJSON`-method:

```js
const jsonWithLimit = fdbgr.toJSON(1);
console.log(jsonWithLimit);

/**
 * Will output somthing like:
 * 
 * { test: [ { _id: 'e89jiljjf', fruit: 'apple' } ] }
 */
```

**Happy debugging!**
