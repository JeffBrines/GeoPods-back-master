interface IStatusCodes {
	OK: number;
	BAD_REQUEST: number;
	UNAUTHORIZED: number;
	FORBIDDEN: number;
	CONFLICT: number;
	SERVER_ERROR: number;
	NOT_FOUND: number;
}

interface IDefaultPagination {
	PAGE: number;
	SIZE: number;
}

export interface IConstants {
	statusCode: IStatusCodes;
	defaultPagination: IDefaultPagination;
}
