/*--------------------libraries--------------------*/
import * as express from 'express';
/*--------------------libraries--------------------*/

/*--------------------middlewares--------------------*/
import auth from '../middlewares/auth';
import validationMiddleware from '../middlewares/validation/validationMiddleware';
import categoryExistMiddleware from '../middlewares/exist/categoryExistMiddleware';
/*--------------------middlewares--------------------*/

/*--------------------controllers--------------------*/
import categoryController from '../controllers/categoryController';
/*--------------------controllers--------------------*/

/*--------------------validation schemes--------------------*/
import categorySchema from '../validation/categoryValidation/categorySchema';
/*--------------------validation schemes--------------------*/

const categoryRouter = express();

categoryRouter.post(
	'/createCategory',
	auth.adminOwnerAuth,
	validationMiddleware(categorySchema),
	categoryController.createCategory,
);

categoryRouter.delete(
	'/deleteCategory',
	auth.adminOwnerAuth,
	categoryExistMiddleware(true),
	categoryController.deleteCategory,
);

categoryRouter.put(
	'/editCategory',
	auth.adminOwnerAuth,
	categoryExistMiddleware(true),
	validationMiddleware(categorySchema),
	categoryController.editCategory,
);

categoryRouter.get(
	'/categories',
	auth.appAuth,
	categoryController.getCategories,
);

export default categoryRouter;
