import { difference, differenceToDistance } from "./util";

/* Canvas: a wrapper around a <canvas> element */
export default class Canvas {
	constructor(width, height) {
		this.node = document.createElement("canvas");
		this.node.width = width;
		this.node.height = height;
		this.ctx = this.node.getContext("2d");
		this._imageData = null;
	}

	static empty(cfg) {
		let canvas = new Canvas(cfg.scale * cfg.width, cfg.scale * cfg.height).fill(cfg.fill);
		canvas.ctx.scale(cfg.scale, cfg.scale);
		return canvas;
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

		return difference(data, dataOther);
	}

	distance(otherCanvas) {
		let difference = this.difference(otherCanvas);
		return differenceToDistance(difference, this.node.width * this.node.height);
	}

	drawStep(step) {
		this.ctx.globalAlpha = step.alpha;
		this.ctx.fillStyle = step.color;
		this.ctx.strokeStyle = step.color;
		step.shape.render(this.ctx);
		return this;
	}
}
