(function() {
	const values = [.5, .7, .1, .2, .8, .4, .9, .3, .6, .01, .99, .68, .38, .18, .77, .91, .53, .22, .47];
	function r() {
		r.seed++;
		return values[r.seed % values.length];
	}
	r.seed = 0;
//	Math.random = r;
})();

export function clamp(x, min, max) {
	return Math.max(min, Math.min(max, x));
}

export function clampColor(x) {
	return clamp(x, 0, 255);
}

export function distanceToDifference(distance, pixels) {
	return Math.pow(distance*255, 2) * (3 * pixels);
}

export function differenceToDistance(difference, pixels) {
	return Math.sqrt(difference / (3 * pixels))/255;
}

export function difference(data, dataOther) {
	let sum = 0, diff;
	for (let i=0;i<data.data.length;i++) {
		if (i % 4 == 3) { continue; }
		diff = dataOther.data[i]-data.data[i];
		sum = sum + diff*diff;
	}

	return sum;
}

function computeColor(offset, imageData, alpha) {
	let color = [0, 0, 0];
	let {shape, current, target} = imageData;
	let shapeData = shape.data;
	let currentData = current.data;
	let targetData = target.data;

	let si, sx, sy, fi, fx, fy; /* shape-index, shape-x, shape-y, full-index, full-x, full-y */
	let sw = shape.width;
	let sh = shape.height;
	let fw = current.width;
	let fh = current.height;
	let count = 0;

	for (sy=0; sy<sh; sy++) {
		fy = sy + offset.top;
		if (fy < 0 || fy >= fh) { continue; } /* outside of the large canvas (vertically) */

		for (sx=0; sx<sw; sx++) {
			fx = offset.left + sx;
			if (fx < 0 || fx >= fw) { continue; } /* outside of the large canvas (horizontally) */

			si = 4*(sx + sy*sw); /* shape (local) index */
			if (shapeData[si+3] == 0) { continue; } /* only where drawn */

			fi = 4*(fx + fy*fw); /* full (global) index */
			color[0] += (targetData[fi] - currentData[fi]) / alpha + currentData[fi];
			color[1] += (targetData[fi+1] - currentData[fi+1]) / alpha + currentData[fi+1];
			color[2] += (targetData[fi+2] - currentData[fi+2]) / alpha + currentData[fi+2];

			count++;
		}
	}

	return color.map(x => ~~(x/count)).map(clampColor);
}

function computeDifferenceChange(offset, imageData, color) {
	let {shape, current, target} = imageData;
	let shapeData = shape.data;
	let currentData = current.data;
	let targetData = target.data;

	let a, b, d1r, d1g, d1b, d2r, d2b, d2g;
	let si, sx, sy, fi, fx, fy; /* shape-index, shape-x, shape-y, full-index */
	let sw = shape.width;
	let sh = shape.height;
	let fw = current.width;
	let fh = current.height;

	var sum = 0; /* V8 opt bailout with let */

	for (sy=0; sy<sh; sy++) {
		fy = sy + offset.top;
		if (fy < 0 || fy >= fh) { continue; } /* outside of the large canvas (vertically) */

		for (sx=0; sx<sw; sx++) {
			fx = offset.left + sx;
			if (fx < 0 || fx >= fw) { continue; } /* outside of the large canvas (horizontally) */

			si = 4*(sx + sy*sw); /* shape (local) index */
			a = shapeData[si+3];
			if (a == 0) { continue; } /* only where drawn */

			fi = 4*(fx + fy*fw); /* full (global) index */

			a = a/255;
			b = 1-a;
			d1r = targetData[fi]-currentData[fi];
			d1g = targetData[fi+1]-currentData[fi+1];
			d1b = targetData[fi+2]-currentData[fi+2];

			d2r = targetData[fi] - (color[0]*a + currentData[fi]*b);
			d2g = targetData[fi+1] - (color[1]*a + currentData[fi+1]*b);
			d2b = targetData[fi+2] - (color[2]*a + currentData[fi+2]*b);

			sum -= d1r*d1r + d1g*d1g + d1b*d1b;
			sum += d2r*d2r + d2g*d2g + d2b*d2b;
		}
	}

	return sum;
}

export function computeColorAndDifferenceChange(offset, imageData, alpha) {
	let rgb = computeColor(offset, imageData, alpha);
	let differenceChange = computeDifferenceChange(offset, imageData, rgb);

	let color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

	return {color, differenceChange};
}

export function getFill(canvas) {
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

export function getScale(width, height, limit) {
    return Math.max(width / limit, height / limit, 1);
}

export function centerPoint(...ps){
	let sum = ps.reduce((r,x)=>[r[0]+x[0],r[1]+x[1]]);
	return [sum[0]/ps.length, sum[1]/ps.length]
}

export function toVector(p1, p2){
	return [(p2[0] - p1[0]), (p2[1] - p1[1])]
}

export function vectorx(v, k){
	return [k*v[0], k*v[1]]
}

export function toPoint(base, ...vs){
	let result = [...base];
	for(let v of vs){
		result[0] += v[0];
		result[1] += v[1];
	}
	return result;
}