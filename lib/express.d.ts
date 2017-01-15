
import {IncomingMessage, ServerResponse} from 'http';
import {EventEmitter} from 'events';
import {Application as _Application} from './application';
import {Request as _Request} from './request';
import {Response as _Response, CookieOptions as _CookieOptions} from './response';
import createRouter = require('./router/index');
import RouteClass = require('./router/route');
import serveStatic = require('serve-static');

declare namespace createApplication {

    // workaround to reexport the interfaces
    export type Request = _Request
    export type Response = _Response
    export type CookieOptions = _CookieOptions
    export type Application = _Application
    export type Router = createRouter.Router
    export type RouterOptions = createRouter.RouterOptions
    export type RequestHandler = createRouter.RequestHandler
    export type ErrorHandler = createRouter.ErrorHandler
    export type ParamHandler = createRouter.ParamHandler
    export type Handler = createRouter.Handler
    export type NextFunction = createRouter.NextFunction

    export interface Server extends Application, EventEmitter {
        (req: IncomingMessage, res: ServerResponse, next?: (err?: Error) => void): void;
    }

    // need to use an interface for this because `static` is a reserved word
    // and cannot be used as a variable identifier
    export interface Express {

        /** Create an express application. */
        (): Server;

        /** The Application prototype */
        application: Application;

        /** The Request prototype */
        request: Request;

        /** The Response prototype */
        response: Response;

        /** The Route constructor */
        Route: typeof RouteClass;

        /** The Router constructor */
        Router: typeof createRouter;

        /** The serve-static middleware */
        static: typeof serveStatic;

        // TODO query
    }
}

declare const createApplication: createApplication.Express;
export = createApplication;
