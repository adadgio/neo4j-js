# Neo4j JS

A Neo4j graph database explorer and admin dashboard written in Javascript.

**----------- UPDATE [4th dec. 2017] -----------**

*This repository is not maintained anymore, but...*

**The brand new [![Neo4j JS v2](https://github.com/adadgio/neo4j-js-ng2) version is here !**

**----------------------------------------------**

## Demo

First demo and pre-release available:

[![Youtube demo](https://i.ytimg.com/vi/kKJzLi-7p_U/1.jpg?time=1451155728744)](https://youtu.be/kKJzLi-7p_U)

## Installation

### Pre-requisites

- Neo4j must be installed [Neo4j quick install instructions here](https://www.digitalocean.com/community/tutorials/how-to-install-neo4j-on-an-ubuntu-vps)
- Neo4j Basic Authentication must have been configured (by default)

### Quick configuration

- Create a virtual host on your machine or server.
- Point the virtual host to the folder where you downloaded Neo4j JS
- Copy `settings-sample.js` to `settings.js`
- Change client `authBasic` value to `Basic: <authString>`. Auth string is a base64 encode of neo4j `username:password`

## Security

- If you don't want anybody to access that interface add HTTP authentication via your Nginx or Apache server
- Alternatively run a PHP server, rename index.html to index.php and setup whatever HTTP auth you like.

## Quick usage and customization

- For quick usage, got to your virtual (or real!) host and explore the graph.

## Going further

### Note

This project relies on requireJS and on the [melody-js](https://github.com/adadgio/melody-js) framework that replicates a Symfony2 like organization in JS while implement ADM architecture.

It also relies on the great [d3js](http://d3js.org) library so you might want to be confortable with that before modifying things in deep.

### Examples

The best example to see how the app works or if you want to configure it, open `bundles/AppBundle/Controller/GraphController`

### Events

#### Application UI/UX events

#### Graph realted events
- `node:click` Happens when you click on a node on the graph (and if create mode is not active)
```
var graph = new Graph({...});
// listen on "graph.$" which is a reference to the jQuery selector of the <svg> to wich the graph is contained.
graph.$.on('node:click', function (e, d) {
    // e is the event
    // d is a d3js node instance (in fact a simple object such as {_id: 3, _properties: ...})
});
```
- `node:dblclick` Happens when you double click on a node (really confortable thing is that node click is not fired)
- `node:create:promise` When you are in create mode, clicking a "long time" on the graph (withou releasing the mouse right away) will trigger that event. Nothing is done in the graph uand the controller (GraphController example) must do the appropriate actions: create a node with cypher and place that new node on the graph is successful
```
... (GraphController.js)

// hook into the graph event triggered in create mode when the mouse is released after a long time
graph.$.on('node:create:promise', function (e, coordinates) {
    _self.onNodeCreatePromise(coordinates);
});
...
onNodeCreatePromise: function (coordinates) {
    var _self = this;

    // create a new node using the factory with no _id, no _labels and no _properties
    var node = Factory.createNode(null, ["Hey","Joe"], {blugr:"kjq"}); // pass null ID, some labels and properties
    var transactions = NodeType.getTransactions(node);

    client.commit(transactions, function (resultSet) {
        var row = resultSet.getDataset()[0];
        // re-load the node from what is returned by the create query and create a proper node just in case
        // (does not launch another MATCH query, just use the RETURN statement of the CREATE statement
        // now enough talking: add it the the graph !:-)
        graph.addNode(Factory.createNode(row['_id'], row['_labels'], row['n']), true, coordinates); // true: force graph update (default) and force coordinates, which should be mouse coordinates ate this point
        _self.onNodeClick(row['_id']); // and by the way open the modal to edit the node


    });
},
...
```

## Licence

You do absolutely what you want with that project (MIT Licence).
