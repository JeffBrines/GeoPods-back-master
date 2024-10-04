export default (): string => {
	let r = Math.random();
	r *= 10000;
	while (r < 1000) {
		r *= 10;
	}
	return Math.round(r).toString();
};
