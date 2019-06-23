# primitive.js

[![Badge](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu/#/zh_CN)

A JavaScript re-creation of the [primitive.lol](http://primitive.lol/) application.

This project works on the ondras/primitive.js, and you can learn more about primitive.js in [primitive.js](https://github.com/ondras/primitive.js)

## What is the difference between this project and ondras/primitive.js

This project works on the ondras/primitive.js, adding some features to that.

- rotatable rectangle
- bezier and straight line
- heart shape
- shapes cache exported by pre-calculating
- packed by rollup.js and provide some interfaces used by your program
- no svg

## Example Usage

```
npm install Easonzero/primitive
```

```js
// require the library will define a primitive `global`
require ('primitive')
let image = 'test.jpg';
let cfg = primitive.DefaultConfig();
// declare the type of shapes our drawing will use:
cfg.shapeTypes = [
  primitive.ShapeMap.Bezier, 
  primitive.ShapeMap.Rectangle, 
  primitive.ShapeMap.Triangle, 
  primitive.ShapeMap.Ellipse, 
  primitive.ShapeMap.Heart, 
  primitive.ShapeMap.Line 
]
cfg.shapes = 500
primitive.Pure(image, cfg).then(function(ori){
	let optimizer = new primitive.Optimizer(ori, cfg);
	let dst = primitive.Canvas.empty(cfg);
	// select element to append the canvas to
	document.querySelector("#result")!.innerHTML = "";
	document.querySelector("#result")!.appendChild(dst.node);
	// draw on dst.node canvas on each step
	optimizer.onStep = function (step){
		console.log('onStep', step);
		dst.drawStep(step);
	}
	// drawing finished
	optimizer.onEnd = function (state){
		console.log('onEnd', state);
	}
	optimizer.start();
});
```
