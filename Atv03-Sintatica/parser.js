var tinynlp=function(){function m(a){this.lhsToRhsList={};for(var c in a){var b=a[c].split("->"),d=b[0].trim(),b=b[1].trim().split("|");this.lhsToRhsList[d]||(this.lhsToRhsList[d]=[]);for(var e in b)this.lhsToRhsList[d].push(b[e].trim().split(" "))}}function h(a){this.idToState={};this.currentId=0;this.chart=[];for(var c=0;c<a.length+1;c++)this.chart[c]=[]}function g(a,c,b,d,e){this.lhs=a;this.rhs=c;this.dot=b;this.left=d;this.right=e;this.id=-1;this.ref=[];for(a=0;a<c.length;a++)this.ref[a]={}}function n(a,
c,b,d){if(c==a.length)d.push(b.slice());else if(0==a[c].length)n(a,c+1,b,d);else for(var e in a[c])if(0==b.length||b[b.length-1].right==a[c][e].left)b.push(a[c][e]),n(a,c+1,b,d),b.pop()}m.prototype.terminalSymbols=function(a){return[]};m.prototype.getRightHandSides=function(a){return(a=this.lhsToRhsList[a])?a:null};m.prototype.isEpsilonProduction=function(a){return"_EPSILON_"==a};loggingOn=!0;h.prototype.addToChart=function(a,c){a.setId(this.currentId);var b=this.chart[c],d;for(d in b){var e=b[d];
if(a.equals(e))return b=!1,b=e.appendRefsToChidStates(a.getRefsToChidStates())}b.push(a);this.idToState[this.currentId]=a;this.currentId++;return!0};h.prototype.getStatesInColumn=function(a){return this.chart[a]};h.prototype.countStatesInColumn=function(a){return this.chart[a].length};h.prototype.getState=function(a){return this.idToState[a]};h.prototype.getFinishedRoot=function(a){var c=this.chart[this.chart.length-1],b;for(b in c){var d=c[b];if(d.complete()&&d.getLeftHandSide()==a)return d}return null};
h.prototype.log=function(a){if(loggingOn){console.log("-------------------");console.log("Column: "+a);console.log("-------------------");for(var c in this.chart[a])console.log(this.chart[a][c].toString())}};g.prototype.complete=function(){return this.dot>=this.rhs.length};g.prototype.toString=function(){var a=[];a.push("(id: "+this.id+")");a.push(this.lhs);a.push("\u2192");for(var c=0;c<this.rhs.length;c++)c==this.dot&&a.push("\u2022"),a.push(this.rhs[c]);this.complete()&&a.push("\u2022");a.push("["+
this.left+", "+this.right+"]");a.push(JSON.stringify(this.ref));return a.join(" ")};g.prototype.expectedNonTerminal=function(a){return null!==a.getRightHandSides(this.rhs[this.dot])?!0:!1};g.prototype.setId=function(a){this.id=a};g.prototype.getId=function(){return this.id};g.prototype.equals=function(a){return this.lhs===a.lhs&&this.dot===a.dot&&this.left===a.left&&this.right===a.right&&JSON.stringify(this.rhs)===JSON.stringify(a.rhs)?!0:!1};g.prototype.getRefsToChidStates=function(){return this.ref};
g.prototype.appendRefsToChidStates=function(a){for(var c=!1,b=0;b<a.length;b++)if(a[b])for(var d in a[b])this.ref[b][d]!=a[b][d]&&(c=!0),this.ref[b][d]=a[b][d];return c};g.prototype.predictor=function(a,c){var b=this.rhs[this.dot],d=a.getRightHandSides(b),e=!1,f;for(f in d){for(var k=d[f],h=0;k&&h<k.length&&a.isEpsilonProduction(k[h]);)h++;k=new g(b,k,h,this.right,this.right);e|=c.addToChart(k,this.right)}return e};g.prototype.scanner=function(a,c,b){var d=this.rhs[this.dot],e=!1;(a=b?a.terminalSymbols(b):
[])||(a=[]);a.push(b);for(var f in a)if(d==a[f]){b=new g(d,[b],1,this.right,this.right+1);e|=c.addToChart(b,this.right+1);break}return e};g.prototype.completer=function(a,c){var b=!1,d=c.getStatesInColumn(this.left),e;for(e in d){var f=d[e];if(f.rhs[f.dot]==this.lhs){for(var k=f.dot+1;f.rhs&&k<f.rhs.length&&a.isEpsilonProduction(f.rhs[k]);)k++;k=new g(f.lhs,f.rhs,k,f.left,this.right);k.appendRefsToChidStates(f.ref);var h=Array(f.rhs.length);h[f.dot]={};h[f.dot][this.id]=this;k.appendRefsToChidStates(h);
b|=c.addToChart(k,this.right)}}return b};g.prototype.traverse=function(){if(1==this.ref.length&&0==Object.keys(this.ref[0]).length){var a=[];this.lhs!=this.rhs&&a.push({root:this.rhs,left:this.left,right:this.right});return[{root:this.lhs,left:this.left,right:this.right,subtrees:a}]}for(var c=[],a=0;a<this.ref.length;a++){c[a]=[];for(var b in this.ref[a])c[a]=c[a].concat(this.ref[a][b].traverse())}b=[];n(c,0,[],b);c=[];for(a in b)c.push({root:this.lhs,left:this.left,right:this.right,subtrees:b[a]});
return c};g.prototype.getLeftHandSide=function(){return this.lhs};var l={};l.Grammar=m;l.State=g;l.Chart=h;l.parse=function(a,c,b){var d=new h(a),e=c.getRightHandSides(b),f;for(f in e){var k=new g(b,e[f],0,0,0);d.addToChart(k,0)}for(f=0;f<a.length+1;f++){for(b=!0;b;)for(b=!1,j=0;j<d.countStatesInColumn(f);)e=d.getStatesInColumn(f)[j],b=e.complete()?b|e.completer(c,d):e.expectedNonTerminal(c)?b|e.predictor(c,d):b|e.scanner(c,d,a[f]),j++;d.log(f)}return d};l.logging=function(a){loggingOn=a};return l}();

// Define grammar
var grammar = new tinynlp.Grammar([
  // Define grammar production rules
  'R -> S',
  'S -> S add_sub M | M | num',
  'M -> M mul_div T | T | num',
  'T -> num',
  
  // Define terminal symbols
  'num -> 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0',
  'add_sub -> + | -',
  'mul_div -> * | /'
]);

// You have to tokenize input by yourself!
// Creating array of tokens
var tokens = '7 - 5 * 3'.split(' ');
console.log({ tokens });

// Parsing
var rootRule = 'R';
var chart = tinynlp.parse(tokens, grammar, rootRule);

// Get array with all parsed trees
// In case of ambiguous grammar - there might be more than 1 parsing tree
var trees =  chart.getFinishedRoot(rootRule).traverse();

// Iterate over all parsed trees and display them on HTML page
/*for (var i in trees) {
  console.log(JSON.stringify(trees[i]))
}*/ 

function toNestedList(tree) {
  if (!tree.subtrees || tree.subtrees.length == 0) {
      return '<li>' + tree.root + '</li>';
  }   
  var builder = []; 
  builder.push('<li>');
  builder.push(tree.root);
  builder.push('<ul>')
  for (var i in tree.subtrees) {
      builder.push(toNestedList(tree.subtrees[i]))
  }   
  builder.push('</ul>')
  builder.push('</li>')
  return builder.join('');
} 

// Iterate over all parsed trees and display them on HTML page
for (var i in trees) {
  htmlRepresentstion = '<ul>' + toNestedList(trees[i]) + '</ul>'
  // embed htmlRepresentstion into HTML page
}

module.exports = toNestedList;