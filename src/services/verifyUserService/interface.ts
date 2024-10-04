import { ID } from 'src/types/mongo';

export interface IBaseVerifyUser {
	user: ID;
	code: string;
	verifyEmail: boolean;
	blockedVerify: boolean;
	blockedTime: Date;
	counterVerify: number;
}
