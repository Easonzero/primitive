import Canvas from "./canvas.js";
import Optimizer from "./optimizer.js";

function go(original, cfg) {

	let optimizer = new Optimizer(original, cfg);
	steps = 0;

	let cfg2 = Object.assign({}, cfg, {width:cfg.scale*cfg.width, height:cfg.scale*cfg.height});
	let result = Canvas.empty(cfg2, false);
	result.ctx.scale(cfg.scale, cfg.scale);
	nodes.raster.appendChild(result.node);

	optimizer.onStep = (step) => {
		if (step) {
			result.drawStep(step);
		}
	}
	optimizer.start();

	document.documentElement.scrollTop = document.documentElement.scrollHeight;
}

Canvas.original(url, cfg).then(original => go(original, cfg));