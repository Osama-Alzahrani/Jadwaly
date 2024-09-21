// also serves as EM units
function pixelsToREM(pixels) {
	let rem = pixels * 0.0625;
	return rem;
}

function remToPixels(rem) {
	let pixels = rem * 16;
	return pixels;
}

function remToVH(rem) {
	let vh = window.innerHeight / (rem * 16);
	return vh;
}

function vhToREM(vh) {
	let rem = window.innerHeight / (100 / vh) * 0.0625;
	return rem;
}

function remToVW(rem) {
	let vw = window.innerWidth / (rem * 16);
	return vw;
}

function vwToREM(vw) {
	let rem = window.innerWidth / (100 / vw) * 0.0625;
	return rem;
}

function pixelsToVW(pixels) {
	let vw = pixels * (100 / window.innerWidth);
	return vw.toFixed(3);
}

function vwToPixels(vw) {
	let pixels = ((vw * window.innerWidth) / 100);
	return pixels;
}

function vhToPixels(vh) {
	let pixels = ((vh * window.innerHeight) / 100);
	return pixels;
}

function pixelsToVH(pixels) {
	let vh = pixels * (100 / window.innerHeight);
	return vh.toFixed(3);
}
