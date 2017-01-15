
import {Server} from 'http';
import {ListenOptions} from 'net';
import {Router, ParamHandler, HandlerArgument, PathArgument} from './router/index';

declare namespace app {
    export interface Application extends Router {
        /**
         * Contains one or more path patterns on which a sub-app was mounted.
         */
        mountpath: string | string[];

        /**
         * Has properties that are local variables within the application.
         * Once set, the value of app.locals properties persist throughout the life of the application,
         * in contrast with res.locals properties that are valid only for the lifetime of the request.
         * You can access local variables in templates rendered within the application.
         * This is useful for providing helper functions to templates, as well as application-level data.
         * Local variables are available in middleware via req.app.locals (see req.app)
         */
        locals: any;

        /**
         * Initialize the server.
         *
         *   - setup default configuration
         *   - setup default middleware
         *   - setup route reflection methods
         */
        init(): void;

        /**
         * Initialize application configuration.
         */
        defaultConfiguration(): void;

        /**
         * Register the given template engine callback `fn`
         * as `ext`.
         *
         * By default will `require()` the engine based on the
         * file extension. For example if you try to render
         * a "foo.jade" file Express will invoke the following internally:
         *
         *     app.engine('jade', require('jade').__express);
         *
         * For engines that do not provide `.__express` out of the box,
         * or if you wish to "map" a different extension to the template engine
         * you may use this method. For example mapping the EJS template engine to
         * ".html" files:
         *
         *     app.engine('html', require('ejs').renderFile);
         *
         * In this case EJS provides a `.renderFile()` method with
         * the same signature that Express expects: `(path, options, callback)`,
         * though note that it aliases this method as `ejs.__express` internally
         * so if you're using ".ejs" extensions you dont need to do anything.
         *
         * Some template engines do not follow this convention, the
         * [Consolidate.js](https://github.com/visionmedia/consolidate.js)
         * library was created to map all of node's popular template
         * engines to follow this convention, thus allowing them to
         * work seamlessly within Express.
         */
        engine(ext: string, fn: Function): Application;

        /**
         * Assign `setting` to `val`, or return `setting`'s value.
         *
         *    app.set('foo', 'bar');
         *    app.get('foo');
         *    // => "bar"
         *    app.set('foo', ['bar', 'baz']);
         *    app.get('foo');
         *    // => ["bar", "baz"]
         *
         * Mounted servers inherit their parent server's settings.
         */
        set(setting: string, val: any): this;
        get(name: string): any;
        // need to duplicate this here from the Router because of the overload
        get(path: PathArgument, ...handlers: HandlerArgument[]): this;

        /**
         * Add callback triggers to route parameters, where name is the name of the parameter or an array of them,
         * and callback is the callback function. The parameters of the callback function are the request object,
         * the response object, the next middleware, the value of the parameter and the name of the parameter,
         * in that order.
         * If name is an array, the callback trigger is registered for each parameter declared in it,
         * in the order in which they are declared. Furthermore, for each declared parameter except the last one,
         * a call to next inside the callback will call the callback for the next declared parameter.
         * For the last parameter, a call to next will call the next middleware in place for the route currently
         * being processed, just like it would if name were just a string.
         * For example, when :user is present in a route path, you may map user loading logic to automatically
         * provide req.user to the route, or perform validations on the parameter input.
         */
        param(name: string | string[], handler: ParamHandler): this;

        /**
         * @deprecated
         */
        param(callback: (name: string, matcher: RegExp) => ParamHandler): this;

        /**
         * Return the app's absolute pathname
         * based on the parent(s) that have
         * mounted it.
         *
         * For example if the application was
         * mounted as "/admin", which itself
         * was mounted as "/blog" then the
         * return value would be "/blog/admin".
         */
        path(): string;

        /**
         * Check if `setting` is enabled (truthy).
         *
         *    app.enabled('foo')
         *    // => false
         *
         *    app.enable('foo')
         *    app.enabled('foo')
         *    // => true
         */
        enabled(setting: string): boolean;

        /**
         * Check if `setting` is disabled.
         *
         *    app.disabled('foo')
         *    // => true
         *
         *    app.enable('foo')
         *    app.disabled('foo')
         *    // => false
         */
        disabled(setting: string): boolean;

        /**
         * Enable `setting`.
         */
        enable(setting: string): this;

        /**
         * Disable `setting`.
         */
        disable(setting: string): this;

        /**
         * Render the given view `name` name with `options`
         * and a callback accepting an error and the
         * rendered template string.
         *
         * Example:
         *
         *    app.render('email', { name: 'Tobi' }, function(err, html){
         *      // ...
         *    })
         */
        render(name: string, locals?: { [local: string]: any }, callback?: (err: Error, html: string) => void): void;
        render(name: string, callback: (err: Error, html: string) => void): void;

        /**
         * Listen for connections.
         *
         * A node `http.Server` is returned, with this
         * application (which is a `Function`) as its
         * callback. If you wish to create both an HTTP
         * and HTTPS server you may do so with the "http"
         * and "https" modules as shown here:
         *
         *    var http = require('http')
         *      , https = require('https')
         *      , express = require('express')
         *      , app = express();
         *
         *    http.createServer(app).listen(80);
         *    https.createServer({ ... }, app).listen(443);
         */
        listen(port: number, hostname?: string, backlog?: number, listeningListener?: Function): Server;
        listen(port: number, hostname?: string, listeningListener?: Function): Server;
        listen(port: number, backlog?: number, listeningListener?: Function): Server;
        listen(port: number, listeningListener?: Function): Server;
        listen(path: string, backlog?: number, listeningListener?: Function): Server;
        listen(path: string, listeningListener?: Function): Server;
        listen(handle: any, backlog?: number, listeningListener?: Function): Server;
        listen(handle: any, listeningListener?: Function): Server;
        listen(options: ListenOptions, listeningListener?: Function): Server;
    }
}

declare const app: app.Application;
export = app;
