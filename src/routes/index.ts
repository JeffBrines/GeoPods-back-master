import * as express from 'express';

import userRouter from './userRouter';
import authRouter from './authRouter';
import adminRouter from './adminRouter';
import podcastRouter from './podcastRouter';
import categoryRouter from './categoryRouter';
import reportRouter from './reportRouter';

const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/podcast', podcastRouter);
apiRouter.use('/category', categoryRouter);
apiRouter.use('/report', reportRouter);

export default apiRouter;
