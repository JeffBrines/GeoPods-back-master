/*--------------------libraries--------------------*/
import * as express from 'express';
/*--------------------libraries--------------------*/

/*--------------------middlewares--------------------*/
import auth from '../middlewares/auth';
import validationMiddleware from '../middlewares/validation/validationMiddleware';
import timeStampsMiddleware from '../middlewares/validation/timeStampsMiddleware';
import podcastExistMiddleware from '../middlewares/exist/podcastExistMiddleware';
/*--------------------middlewares--------------------*/

/*--------------------controllers--------------------*/
import podcastController from '../controllers/podcastController';
/*--------------------controllers--------------------*/

/*--------------------validation schemes--------------------*/
import createPodcastSchema from '../validation/podcastValidation/createPodcastSchema';
import submitPodcastSchema from '../validation/podcastValidation/submitPodcastSchema';
import editPodcastSchema from '../validation/podcastValidation/editPodcastSchema';
import reviewPodcastSchema from '../validation/podcastValidation/reviewPodcastSchema';
import searchPodcastByTitleSchema from '../validation/podcastValidation/searchPodcastByTitleSchema';
import searchPodcastByUserSchema from '../validation/podcastValidation/searchPodcastByUserSchema';
/*--------------------validation schemes--------------------*/

const podcastRouter = express();

podcastRouter.post(
	'/createPodcast',
	auth.appAuth,
	validationMiddleware(createPodcastSchema),
	timeStampsMiddleware,
	podcastController.createPodcast,
);

podcastRouter.post(
	'/submitPodcast',
	auth.appAuth,
	validationMiddleware(submitPodcastSchema),
	timeStampsMiddleware,
	podcastController.submitPodcast,
);

podcastRouter.post(
	'/searchPodcast',
	auth.appAuth,
	validationMiddleware(searchPodcastByTitleSchema),
	podcastController.searchPodcast,
);

podcastRouter.post(
	'/nearby',
	auth.appAuth,
	validationMiddleware(searchPodcastByTitleSchema),
	podcastController.nearbyPodcasts
);

podcastRouter.post(
	'/ratingPodcast',
	auth.appAuth,
	podcastExistMiddleware(true),
	validationMiddleware(reviewPodcastSchema),
	podcastController.setReviewPodcast,
);

podcastRouter.post(
	'/searchUser',
	auth.appAuth,
	validationMiddleware(searchPodcastByUserSchema),
	podcastController.searchUser,
);

podcastRouter.delete(
	'/deletePodcast',
	auth.appAuth,
	podcastExistMiddleware(true),
	podcastController.deletePodcast,
);

podcastRouter.delete(
	'/deleteReview',
	auth.appAuth,
	podcastController.deleteReview
);

podcastRouter.put(
	'/editPodcast',
	auth.appAuth,
	podcastExistMiddleware(true),
	validationMiddleware(editPodcastSchema),
	timeStampsMiddleware,
	podcastController.editPodcast,
);

podcastRouter.get(
	'/allPodcasts',
	auth.appAuth,
	podcastController.getAllPodcasts,
);

podcastRouter.get(
	'/podcast',
	auth.appAuth,
	podcastExistMiddleware(true),
	podcastController.getPodcast,
);

podcastRouter.get(
	'/getMyPodcasts',
	auth.appAuth,
	podcastController.getMyPodcasts,
);

podcastRouter.get(
	'/rating',
	auth.appAuth,
	podcastController.getUserRating
);

podcastRouter.get(
	'/getReviews',
 	auth.appAuth,
	podcastController.getReviews,
);

podcastRouter.get(
	'/getSearchList',
	auth.appAuth,
	podcastController.getSearchList
);

export default podcastRouter;
