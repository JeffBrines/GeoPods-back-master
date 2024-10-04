/*--------------------libraries--------------------*/
import * as express from 'express';
/*--------------------libraries--------------------*/

/*--------------------middlewares--------------------*/
import auth from '../middlewares/auth';
import validationMiddleware from '../middlewares/validation/validationMiddleware';
/*--------------------middlewares--------------------*/

/*--------------------controllers--------------------*/
import reportController from '../controllers/reportController';
/*--------------------controllers--------------------*/

/*--------------------validation schemes--------------------*/
import reportSchema from '../validation/reportValidation/reportSchema';


const reportRouter = express.Router();


reportRouter.post(
    '/sendUserReport',
    auth.appAuth,
    validationMiddleware(reportSchema),
    reportController.sendUserReport,
);

reportRouter.post(
    '/sendPodcastReport',
    auth.appAuth,
    validationMiddleware(reportSchema),
    reportController.sendPodcastReport,
);

reportRouter.post(
    '/sendReviewReport',
    auth.appAuth,
    validationMiddleware(reportSchema),
    reportController.sendReviewReport
);

reportRouter.get(
    '/getUserReports',
    auth.adminAuth,
    reportController.getUserReports,
);

reportRouter.get(
    '/getPodcastReports',
    auth.adminAuth,
    reportController.getPodcastReports,
);

reportRouter.get(
    '/getReviewReports',
    auth.adminAuth,
    reportController.getReviewReports,
);

reportRouter.delete(
    '/deleteUserReport',
    auth.adminAuth,
    reportController.deleteUserReport,
);

reportRouter.delete(
    '/deletePodcastReport',
    auth.adminAuth,
    reportController.deletePodcastReport,
);

reportRouter.delete(
    '/deleteReviewReport',
    auth.adminAuth,
    reportController.deleteReviewReport,
);

export default reportRouter;