
import express = require('express');
import {createServer} from 'http';
import router from './router';

const app = express();

createServer(app).listen(3000);

// requesthandler
const requestHandler: express.RequestHandler = (req, res, next) => {
    console.log(req.ip);
    res.json({hello: 'world'});
    req.app.get('some_setting');
    next(new Error());
};

app.get('/hello-world', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.hostname);
    res.send('Hello World');
    next();
});

app.put('/users/:userId', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(400);
});

// errorhandler
const errorHandler: express.ErrorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
};

app.use(errorHandler);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
});

// call with array
app.use([requestHandler, requestHandler]);
app.use(requestHandler, [requestHandler], errorHandler);

// get / set
app.set('some_setting', 'some_value');
console.log(app.get('some_setting'));

// mount router
app.use('/mountpath', router);
app.use(/\/mountpath/, router);
app.use(['/mountpath', /\/mountpath/], router);
app.use(['/mountpath', '/mountpath(\.html)?', /\/[a-z](\.html)?/], router);
app.use(router);

app.listen(8080);
