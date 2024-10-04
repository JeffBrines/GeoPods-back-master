/*--------------------libraries--------------------*/
import * as express from 'express';
/*--------------------libraries--------------------*/

/*--------------------middlewares--------------------*/
import auth from '../middlewares/auth';
import validationMiddleware from '../middlewares/validation/validationMiddleware';
/*--------------------middlewares--------------------*/

/*--------------------controllers--------------------*/
import authController from '../controllers/authController';
/*--------------------controllers--------------------*/

/*--------------------validation schemes--------------------*/
import LoginUserSchema from '../validation/userValidation/loginUserSchema';
import RegisterUserSchema from '../validation/userValidation/registerUserSchema';
import EmailSchema from '../validation/userValidation/userEmailSchema';
import tokenAuthSchema  from '../validation/userValidation/tokenAuthSchema';
/*--------------------validation schemes--------------------*/

const authRouter = express.Router();

//google
authRouter.post('/googleAuth', authController.google);
//google

//apple
authRouter.post(
	'/apple',
	validationMiddleware(tokenAuthSchema),
	authController.apple,
);
//apple

//registration
authRouter.post(
	'/register',
	validationMiddleware(RegisterUserSchema),
	authController.register,
);

authRouter.post('/verify/:code', auth.temporaryAuth, authController.verify);
//registration

//forgot Password
authRouter.post(
	'/sendEmail',
	validationMiddleware(EmailSchema),
	authController.sendEmail,
);

authRouter.post(
	'/forgotVerify/:code',
	auth.temporaryAuth,
	authController.forgotVerify,
);

authRouter.post(
	'/forgotNewPassword',
	auth.recoveryAuth,
	authController.forgotNewPassword,
);
//forgot password

//login
authRouter.post(
	'/login',
	validationMiddleware(LoginUserSchema),
	authController.login,
);
//login

export default authRouter;
