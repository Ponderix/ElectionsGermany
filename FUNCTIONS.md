# Functions Guide
A guide to functions used in this project. Useful for those who want to edit and/or improve this project. To successfully follow this guide you will need a mediocore understanding of JavaScript arrays and basic knowledge about [d3.js](https://d3js.org/).
- [Misc. Functions](#functions)
- [Graph Functions](#graph)
- [Map Functions](#map)
- [Userinput Functions](#userinput)
- [Data Functions](#data)
- [Table Functions] (#table)

## [Functions.js](script/functions.js) <a name="functions"></a>

### [#](#zoomed) *functions*.zoomed(event)
The function used to apply a certain zoom behaviour to a SVG object. In this case it applies a simple geometric zoom, where the size of the elements do not adapt to the scale the users has zoomed in to.
This function should be used within a zoom variable which is later called on a SVG element.

*Note that the zoomed function applies itself to a variable defined outside of the function which means that this cannot easily be applied freely, you would have to change the function itself.*

<a name="zoomed"></a>
```js
var zoom = d3.zoom().on("zoom", functions.zoomed);
selection.call(zoom);
```

A full tutorial on d3 zooming can be found [here](https://www.freecodecamp.org/news/get-ready-to-zoom-and-pan-like-a-pro-after-reading-this-in-depth-tutorial-5d963b0a153e/). It is important to remember that in d3.js v5+ the syntax has changed for a few functions.


### [#](#zoomTo) *functions*.zoomTo(path, zoom) <a name="zoomTo"></a>
Used to zoom to a certain SVG path. The first parameter being the path it should zoom to and the second being the zoom variable it should apply.


### [#](#remove_zero) *functions*.removeZero(array, secondIndex)
Removes all indices with the value of zero. This is done by first ordering the array from largest to smallest and then looping through it to check the first index which has a value of zero. It then removes all values from that index onwards to the end of the array as after the value zero, all values have to be the same or equal to zero.
However due to the technicality this will remove all numbers **less or equal to** zero, however in this context it is irrelevant as no party can get under zero votes.


This function only works on two dimensional arrays where the numerical values are placed all at the same second index.
<a name="remove_zero"></a>
```js
var foo = [["a", 0], ["b", 2], ["d", 3], ["c", 1]];
functions.removeZero(foo, 1);
```
*ordered array, this happens during the function process*
```js
[["d", 3], ["b", 2], ["c", 1], ["a", 0]]
```
OUTPUT:
```js
[["d", 3], ["b", 2], ["c", 1]]
```


### [#](#which_value) *functions*.whichValue(array, value)
A function which extracts certain values from a two dimensional array and returns an array of these values. Let's say you have a two dimensional array of countries and some sort of corresponding value. This would then be useful if you just wanted to extract the values, not the country names. However this only works if the values were to be in the same spot in every array.
The "array" parameter defines the array you want to extract the values from. The "value" parameter defines the index the wanted values are placed on.


For example:
<a name="which_value"></a>
```js
var countries = [
["Germany", 12],
["China", 1583],
["USA", 14231]
];

functions.whichValue(countries, 1);
```
The function is called upon the array "countries", it will now get all values in position [x][1] and push it to a new array. In this case positions [x][1] are the values corresponding with the countries.<br/>
OUTPUT:
```js
[12, 1583, 15231]
```


### [#](#which_vote) *functions*.whichVote(num)
A function specifically tailored to the German election system, due to there always being two results. One being the first vote (Erst Stimme), the vote given to elect a direct candidate, similar to the British and Canadian system; and one being the second vote (Zweit Stimme), which is given to a party. This latter determining the composition of the Bundestag as a whole.


Due to this I needed a way to manipulate the data so that by changing the value of one variable the entire results would be switched to the other vote. The solution is thisfunction which will always return 0 or -1. If the vote being shown should be the Erst Stimme the variable `vote` would be changed to 1, as a consequence the function would return 0. This value would then be added to the index of the data, in this case it would not change by anything since the default vote *is* the first vote.


If it should be changed to the Zweit Stimme, the variable `vote` would be changed to 2. When this variable is passed through the function it returns -1 because all the second vote results are one column before the first vote on the data file.<br/>
Here is what I mean:
<a name="which_vote"></a>
```js
var vote = 1;
var cdu = data[0][10 + functions.whichVote(vote)] * 100
        spd = data[0][14 + functions.whichVote(vote)] * 100
        linke = data[0][18 + functions.whichVote(vote)] * 100
        gruene = data[0][22 + functions.whichVote(vote)] * 100
        csu = data[0][26 + functions.whichVote(vote)] * 100
        fdp = data[0][30 + functions.whichVote(vote)] * 100
        afd = data[0][34 + functions.whichVote(vote)] * 100
        other = data[0][38 + functions.whichVote(vote)] * 100;
```
Still confused? Contact me at germanelectionmaps@gmail.com or [twitter]()


### [#](#round) *functions*.round(num, decimal)
A function to round to a set amount of decimal places. The "num" parameter is the number which would be rounded. The "decimal" parameter is the amount of decimals after the point, a "2" would mean two decimals after the point, a "3" would mean three decimals places after the point etc. However, you can also go the opposite way, "-1" would be to the nearest 10, "-2" would be to the nearest 100 etc.


In the function the number 10 is raised to the value of the "decimal" parameter. This is needed because the JavaScript rounding functions only rounds decimals to the nearest integer. To get around this issue you would need to multiply the given value by a power of 10 (depending on how many decimal places you want), and then divide it by the same value after rounding it. For example; say you want to round 12.271 to the nearest 10th, the steps would go as following:
```js
//nearest 10th => multiply by 10
var input = 12.271 * 10; //122.71
var rounded = Math.round(input); //output would be 123, to solve this divide it
rounded / 10; //output would be 12.3
```
As seen, this process is quite tedious. This function just shortens this process. Here is how it would be used:
<a name="round"></a>
```js
functions.round(12.271, 1);
```
OUTPUT:
```js
12.3
```

### [#](#get_margin) *functions*.getMargin(array)
A function to get the difference, aka the margin, between the largest and second largest value in an array. It can be applied universally and does not need any special inputs. The "array" parameter is the array the function should be applied to. The function first finds the largest value, removes this value from the array and finds the largest value from the remaining array, essentially getting the first and second largest values. It subtracts these values from each other to get the margin.
<a name="get_margin"></a>
```js
var arr = [10, 13, 23, 28];

functions.getMargin(arr);
```
OUTPUT:
```js
5 //28-23 = 5
```

## [Graph.js](script/graph.js) <a name="graph"></a>

## [Map.js](script/map.js) <a name="map"></a>

## [Userinput.js](script/userinput.js) <a name="userinput"></a>

## [Data.js](script/data.js) <a name="data"></a>

## [Table.js](script/table.js) <a name="table"></a>
