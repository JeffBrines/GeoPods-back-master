import * as mongoose from 'mongoose';

import UserModel from './models/user';
import AdminModel from './models/admin';
import AppTokenModel from './models/appToken';
import AdminTokenModel from './models/adminToken';
import CategoryModel from './models/category';
import VerifyModel from './models/verifyUser';
import PodcastModel from './models/podcast';
import UserReportModel from './models/userReport';
import PodcastReportModel from './models/podcastReport';
import ReviewReportModel from './models/reviewReport';
import ReviewModel from './models/review';


import config from '../config';

mongoose.connect(config.mongoDb.uri).then(() => {
	console.log(
		`Connected to db: ${config.mongoDb.uri.split('/')[3].split('?')[0]}`,
	);
});

export default {
	UserModel,
	AdminModel,
	AppTokenModel,
	AdminTokenModel,
	CategoryModel,
	VerifyModel,
	PodcastModel,
	UserReportModel,
	PodcastReportModel,
	ReviewReportModel,
	ReviewModel,
};
