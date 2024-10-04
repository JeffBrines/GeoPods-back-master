import { Document } from 'mongoose';

import {
	IBaseAdminToken,
	IBaseAppToken,
} from '../../services/tokenService/interface';
import {
	IBaseUserReport,
	IBasePodcastReport,
	IBaseReviewReport,
} from '../../services/reportService/interface';
import {
	IBasePodcast,
	IBaseReview
} from '../../services/podcastService/interfaces';
import { IFullUser } from '../../services/userService/intefraces';
import { IBaseCategory } from '../../services/categoryService/interfaces';
import { IBaseVerifyUser } from '../../services/verifyUserService/interface';
import { IBaseAdmin } from '../../services/adminService/interfaces';

export interface IUser extends IFullUser, Document {}
export interface IPodcast extends IBasePodcast, Document {}
export interface IAdminToken extends IBaseAdminToken, Document {}
export interface IAppToken extends IBaseAppToken, Document {}
export interface ICategory extends IBaseCategory, Document {}
export interface IVerifyUser extends IBaseVerifyUser, Document {}
export interface IAdmin extends IBaseAdmin, Document {}
export interface IUserReport extends IBaseUserReport, Document {}
export interface IPodcastReport extends IBasePodcastReport, Document {}
export interface IReviewReport extends IBaseReviewReport, Document {}
export interface IReview extends IBaseReview, Document {}
