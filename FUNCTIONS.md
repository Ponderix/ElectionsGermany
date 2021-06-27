# Functions Guide
A guide to functions used in this project. Useful for those who want to edit and/or improve this project.
- [Misc. Functions](#functions)
- [Graph Functions](#graph)
- [Map Functions](#map)

## [Functions.js](script/functions.js) <a name="functions"></a>

### [#](#zoomed) *functions*.zoomed(event)
The function used to apply a certain zoom behaviour to a SVG object. In this case it applies simple geometric zoom where the size of the elements do not adapt to the scale the users has zoomed in or out.
This function should be used within a zoom variable which is later called on a SVG element.

*Note that the zoomed function applies the transformation to a variable defined outside of the function which means that this cannot easily be applied anywhere you want to, you would have to change the function itself.*

<a name="zoomed"></a>
```js
var zoom = d3.zoom().on("zoom", functions.zoomed);
selection.call(zoom);
```

A full tutorial on d3 zooming can be found [here](https://www.freecodecamp.org/news/get-ready-to-zoom-and-pan-like-a-pro-after-reading-this-in-depth-tutorial-5d963b0a153e/).


### [#](#zoomTo) *functions*.zoomTo(path, zoom) <a name="zoomTo"></a>
Used to zoom to a certain SVG path. The first parameter being the path it should zoom to and the second being the zoom variable it should apply.


### [#](#remove_zero) *functions*.removeZero(array, secondIndex)
Removes all index with the value of zero. This is done by first ordering the array from largest to smallest and then looping through it to check the first index which has a value of zero. It then removes all values from that index onwards to the end of the array as after the value zero, all values have to be the same or equal to zero.
However due to the technicality this will remove all numbers **less or equal to** zero, however in this context it is irrelevant as no party can get under zero votes.


This function only works on two dimensional arrays where the numerical values are placed all at the same second index.
<a name="remove_zero"></a>
```js
var foo = [["a", 0], [b, "2"], [d, "3"], [c, "1"]];
functions.removeZero(foo, 1);
```
*ordered array, this happens during the function process*
```js
[["d", 3], [b, "2"], [c, "1"], [a, "0"]]
```
output:
```js
[["d", 3], [b, "2"], [c, "1"]]
```

## [Graph.js](script/graph.js) <a name="graph"></a>

## [Map.js](script/map.js) <a name="map"></a>
