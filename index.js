import Canvas from "./src/canvas";
import { getFill, getScale } from "./src/util";
import Optimizer from "./src/optimizer";
import { ShapeMap } from "./src/shape"
import Step from "./src/step";

const Pure = (url, cfg) => new Promise(resolve => {
	let img = new Image();
	img.crossOrigin = true;
	img.src = url;
	img.onload = e => {
		let w = img.naturalWidth;
		let h = img.naturalHeight;
		let computeScale = getScale(w, h, cfg.computeSize);
		cfg.width = w / computeScale;
		cfg.height = h / computeScale;

		let viewScale = getScale(w, h, cfg.viewSize);

		cfg.scale = computeScale / viewScale;

		let canvas = new Canvas(cfg.width, cfg.height).fill(cfg.fill);
		canvas.ctx.drawImage(img, 0, 0, cfg.width, cfg.height);

		if (cfg.fill === "auto") {
			cfg.fill = getFill(canvas);
		}

		resolve(canvas, cfg);
	};
	img.onerror = e => {
		console.error(e);
		alert("The image URL cannot be loaded. Does the server support CORS?");
	}
});

const DefaultConfig = () => ({
	alpha: 0.5,
	computeSize: 512,
	viewSize: 512,
	fill: "rgb(255, 255, 255)",
	mutateAlpha: true,// auto detect alpha
	mutations: 30,// stop optimization nums
	scale: 1,
	shapeTypes: [ShapeMap.bezier],
	shapes: 200,
	steps: 1000,
});

window.$P = window.primitive = {
	Canvas,
	Optimizer,
	Step,
	ShapeMap,
	Pure,
	DefaultConfig
}