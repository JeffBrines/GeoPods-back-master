/*--------------------libraries--------------------*/
import * as express from 'express';
/*--------------------libraries--------------------*/

/*--------------------middlewares--------------------*/
import auth from '../middlewares/auth';
import validationMiddleware from '../middlewares/validation/validationMiddleware';
/*--------------------middlewares--------------------*/

/*--------------------controllers--------------------*/
import userController from '../controllers/userController';
/*--------------------controllers--------------------*/

/*--------------------validation schemes--------------------*/
import editProfileSettingsSchema from '../validation/userValidation/editProfileSettingsSchema';
import editProfileSchema from '../validation/userValidation/editProfileSchema';
/*--------------------validation schemes--------------------*/

const userRouter = express.Router();

userRouter.post(
	'/addToListeningQueue',
	auth.appAuth,
	userController.addToListeningQueue	
);

userRouter.get(
	'/profile',
	auth.appAuth,
	userController.profile
);

userRouter.put(
	'/editProfile',
	auth.appAuth,
	validationMiddleware(editProfileSchema),
	userController.editProfile,
);

userRouter.get('/searchList', auth.appAuth, userController.getSearchList);

userRouter.get(
	'/profileSettings',
	auth.appAuth,
	userController.profileSettings,
);

userRouter.get(
	'/listeningQueue',
	auth.appAuth,
	userController.getListeningQueue
);

userRouter.put(
	'/editProfileSettings',
	auth.appAuth,
	validationMiddleware(editProfileSettingsSchema),
	userController.editProfileSettings,
);

userRouter.put('/oldNewPassword', auth.appAuth, userController.oldNewPassword);

userRouter.delete('/deleteProfile', auth.appAuth, userController.deleteProfile);

userRouter.delete(
	'/deleteFromListeningQueue',
	auth.appAuth,
	userController.deleteFromListeningQueue	
);

export default userRouter;
