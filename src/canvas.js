import * as util from "./util.js";

function getScale(width, height, limit) {
	return Math.max(width / limit, height / limit, 1);
}

/* FIXME move to util */
function getFill(canvas) {
	let data = canvas.getImageData();
	let w = data.width;
	let h = data.height;
	let d = data.data;
	let rgb = [0, 0, 0];
	let count = 0;
	let i;

	for (let x=0; x<w; x++) {
		for (let y=0; y<h; y++) {
			if (x > 0 && y > 0 && x < w-1 && y < h-1) { continue; }
			count++;
			i = 4*(x + y*w);
			rgb[0] += d[i];
			rgb[1] += d[i+1];
			rgb[2] += d[i+2];
		}
	}

	rgb = rgb.map(x => ~~(x/count)).map(util.clampColor);
	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/* Canvas: a wrapper around a <canvas> element */
export default class Canvas {
	static empty(cfg, svg) {
		return new this(w, h).fill(cfg.fill);
	}

	static original(url, cfg) {
		return new Promise(resolve => {
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

				let canvas = this.empty(cfg);
				canvas.ctx.drawImage(img, 0, 0, cfg.width, cfg.height);

				if (cfg.fill == "auto") { cfg.fill = getFill(canvas); }

				resolve(canvas);
			}
			img.onerror = e => {
				console.error(e);
				alert("The image URL cannot be loaded. Does the server support CORS?");
			}
		});
	}

	constructor(width, height) {
		this.node = document.createElement("canvas");
		this.node.width = width;
		this.node.height = height;
		this.ctx = this.node.getContext("2d");
		this._imageData = null;
	}

	clone() {
		let otherCanvas = new this.constructor(this.node.width, this.node.height);
		otherCanvas.ctx.drawImage(this.node, 0, 0);
		return otherCanvas;
	}

	fill(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.node.width, this.node.height);
		return this;
	}

	getImageData() {
		if (!this._imageData) {
			this._imageData = this.ctx.getImageData(0, 0, this.node.width, this.node.height);
		}
		return this._imageData;
	}

	difference(otherCanvas) {
		let data = this.getImageData();
		let dataOther = otherCanvas.getImageData();

		return util.difference(data, dataOther);
	}

	distance(otherCanvas) {
		let difference = this.difference(otherCanvas);
		return util.differenceToDistance(difference, this.node.width*this.node.height);
	}

	drawStep(step) {
		this.ctx.globalAlpha = step.alpha;
		this.ctx.fillStyle = step.color;
		step.shape.render(this.ctx);
		return this;
	}
}
