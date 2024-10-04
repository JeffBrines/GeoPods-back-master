const EARTH_RADIUS = 6372795;

export default {
	calculateTheDistance(
		lat1: number,
		long1: number,
		lat2: number,
		long2: number,
	): number {
		//Coordinates in radians

		const lat1Radian = (lat1 * Math.PI) / 180;
		const long1Radian = (long1 * Math.PI) / 180;

		const lat2Radian = (lat2 * Math.PI) / 180;
		const long2Radian = (long2 * Math.PI) / 180;

		//cos and sin latitude and longitude differences

		const cosLat1 = Math.cos(lat1Radian);
		const cosLat2 = Math.cos(lat2Radian);

		const sinLat1 = Math.sin(lat1Radian);
		const sinLat2 = Math.sin(lat2Radian);

		const differenceLong = long2Radian - long1Radian;

		const cosDifference = Math.cos(differenceLong);
		const sinDifference = Math.sin(differenceLong);

		//calculating length of the big circle

		const y = Math.sqrt(
			Math.pow(cosLat2 * sinDifference, 2) +
				Math.pow(
					cosLat1 * sinLat2 - sinLat1 * cosLat2 * cosDifference,
					2,
				),
		);
		const x = sinLat1 * sinLat2 + cosLat1 * cosLat2 * cosDifference;

		const ad = Math.atan2(y, x);
		const data = Math.round(((ad * EARTH_RADIUS) / 1000) * 0.6214);
		return data < 0 ? -1 * data : data;
	},
};
