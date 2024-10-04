export function checkFiveMinutes(date: Date): boolean {
	if (!date) {
		date = new Date(0);
	}
	const now = new Date();
	const differenceTimeMilsec = now.getMilliseconds() - date.getMilliseconds();
	const minutes = differenceTimeMilsec / (60 * 1000);
	if (minutes < 5) {
		return true;
	}
	return false;
}
