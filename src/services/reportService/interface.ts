import { ID } from '../../types/mongo';

export interface IReport {
    from: ID;
    message: string;
}

export interface IPodcastField {
	suspectPodcast: ID;
}

export interface IUserField {
	suspectUser: ID;
}

export interface IReviewField {
    suspectReview: ID;
}

export interface IBaseUserReport extends IReport, IUserField {}
export interface IBasePodcastReport extends IReport, IPodcastField {}
export interface IBaseReviewReport extends IReport, IReviewField {}