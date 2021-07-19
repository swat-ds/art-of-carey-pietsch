// using js as a data source example
const items = require('./works.json');

module.exports = function(){

  let tags = new Set(items.map(d => d.fields.Group));
  let collection = {};
  collection.items = items.map((d,i) => {
    d.fields.id = String(i+1).padStart(3,'000');
    return d.fields;
  });
  collection.tags = [...tags].sort();
  return collection;
}