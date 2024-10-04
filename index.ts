import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as fileUpload from 'express-fileupload';
import * as path from 'path';

import { Application } from 'express';

import config from './src/config';
import apiRouter from './src/routes';
import ErrorHandler from './src/errors/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../../GeoPods-admin-/build')));

app.listen(config.app.port, () => {
	console.log(`Server launched on port: ${config.app.port}`);
});

app.use('/api', apiRouter);

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../../GeoPods-admin-/build', 'index.html'));
});

app.use(ErrorHandler);
