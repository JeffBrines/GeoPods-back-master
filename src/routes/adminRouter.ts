/*--------------------libraries--------------------*/
import * as express from 'express';
/*--------------------libraries--------------------*/

/*--------------------middlewares--------------------*/
import auth from '../middlewares/auth';
import validationMiddleware from '../middlewares/validation/validationMiddleware';
/*--------------------middlewares--------------------*/

/*--------------------controllers--------------------*/
import adminController from '../controllers/adminController';
/*--------------------controllers--------------------*/

/*--------------------validation schemes--------------------*/
import createAdminSchema from '../validation/adminValidation/createAdminSchema';
import editPodcastSchema from '../validation/adminValidation/editPodcastSchema';
import editProfileSchema from '../validation/userValidation/editProfileSchema';
/*--------------------validation schemes--------------------*/

const adminRouter = express.Router();

adminRouter.post('/login', adminController.login);

adminRouter.post('/refreshToken', adminController.refreshToken);

adminRouter.delete(
	'/deleteAdmin',
	auth.adminOwnerAuth,
	adminController.deleteAdmin,
);

adminRouter.delete(
	'/deleteUser',
	auth.adminOwnerAuth,
	adminController.deleteUser,
);

adminRouter.delete(
	'/deleteReview',
	auth.adminAuth,
	adminController.deleteReview,
);

adminRouter.delete(
	'/deletePodcast',
	auth.adminAuth,
	adminController.deletePodcast
);

adminRouter.post(
	'/createAdmin',
	auth.adminOwnerAuth,
	validationMiddleware(createAdminSchema),
	adminController.createAdmin,
);

adminRouter.post(
	'/sendMail',
	auth.adminAuth,
	adminController.sendMail,
);

adminRouter.post(
	'/blockUser',
	auth.adminAuth,
	adminController.blockUser
);

adminRouter.post(
	'/unblockUser',
	auth.adminAuth,
	adminController.unblockUser
);

adminRouter.post(
	'/enable-reviews',
	auth.adminAuth,
	adminController.enableReviews
);

adminRouter.put(
	'/editPodcast',
	auth.adminAuth,
	validationMiddleware(editPodcastSchema),
	adminController.editPodcast
);

adminRouter.patch(
	'/edit-user',
	auth.adminAuth,
	validationMiddleware(editProfileSchema),
	adminController.editUser
);

adminRouter.get(
	'/getAdmins', 
	auth.adminOwnerAuth, 
	adminController.getAdmins
);

adminRouter.get(
	'/getPodcasts',
	auth.adminAuth,
	adminController.getPodcasts
);

adminRouter.get(
	'/getUsers',
	auth.adminAuth,
	adminController.getUsers
);

adminRouter.get(
	'/getUserAnalytics',
	auth.adminAuth,
	adminController.getUserAnalytics
);

adminRouter.get(
	'/getTopUsers',
	auth.adminAuth,
	adminController.getTopUsers
);

adminRouter.get(
	'/getCountryAnalytics',
	auth.adminAuth,
	adminController.getCountryAnalytics
);

export default adminRouter;
