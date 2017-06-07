
import {IncomingMessage} from 'http';
import {Application} from './application';
import Route = require('./router/route');

declare namespace req {

    export interface RangeOptions {
        /**
         * Specifies if overlapping & adjacent ranges should be combined, defaults to `false`.
         * When `true`, ranges will be combined and returned as if they were specified that
         * way in the header.
         *
         * ```js
         * parseRange(100, 'bytes=50-55,0-10,5-10,56-60', { combine: true })
         * // => [
         * //      { start: 0,  end: 10 },
         * //      { start: 50, end: 60 }
         * //    ]
         * ```
         */
        combined?: boolean;
    }

    export interface Range {
        start: number;
        end: number;
    }

    export interface Request extends IncomingMessage {

        /**
         * Return the protocol string "http" or "https"
         * when requested with TLS. When the "trust proxy"
         * setting is enabled the "X-Forwarded-Proto" header
         * field will be trusted. If you're running behind
         * a reverse proxy that supplies https for you this
         * may be enabled.
         */
        protocol: string;

        /**
         * Short-hand for:
         *
         *    req.protocol == 'https'
         */
        secure: boolean;

        /**
         * Return the remote address, or when
         * "trust proxy" is `true` return
         * the upstream addr.
         */
        ip: string;

        /**
         * When "trust proxy" is `true`, parse
         * the "X-Forwarded-For" ip address list.
         *
         * For example if the value were "client, proxy1, proxy2"
         * you would receive the array `["client", "proxy1", "proxy2"]`
         * where "proxy2" is the furthest down-stream.
         */
        ips: string[];

        /**
         * Return subdomains as an array.
         *
         * Subdomains are the dot-separated parts of the host before the main domain of
         * the app. By default, the domain of the app is assumed to be the last two
         * parts of the host. This can be changed by setting "subdomain offset".
         *
         * For example, if the domain is "tobi.ferrets.example.com":
         * If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
         * If "subdomain offset" is 3, req.subdomains is `["tobi"]`.
         */
        subdomains: string[];

        /**
         * Short-hand for `url.parse(req.url).pathname`.
         */
        path: string;

        /**
         * Parse the "Host" header field hostname.
         */
        hostname: string;

        /**
         * @deprecated Use hostname instead.
         */
        host: string;

        /**
         * Check if the request is fresh, aka
         * Last-Modified and/or the ETag
         * still match.
         */
        fresh: boolean;

        /**
         * Check if the request is stale, aka
         * "Last-Modified" and / or the "ETag" for the
         * resource has changed.
         */
        stale: boolean;

        /**
         * Check if the request was an _XMLHttpRequest_.
         */
        xhr: boolean;

        /**
         * Contains a string corresponding to the HTTP method of the request: GET, POST, PUT, and so on.
         */
        method: string;

        /**
         * req.url is not a native Express property, it is inherited from Node's http
         * module. In opposite to req.originalUrl, req.url is rewritten for internal
         * routing purposes. For example, the "mounting"" feature of app.use() will
         * rewrite req.url to strip the mount point.
         */
        url: string; // needs to be redefined because IncomingMessage.url is optional

        /**
         * This property is an object containing a property for each query string parameter in the
         * route. If there is no query string, it is the empty object, {}.
         */
        query: {
            [queryParam: string]: string;
        };

        /**
         * Contains the currently-matched route
         */
        route: Route;

        /**
         * This property is much like req.url; however, it retains the original request URL, allowing you to rewrite
         * req.url freely for internal routing purposes. For example, the “mounting” feature of app.use() will
         * rewrite req.url to strip the mount point.
         *
         *     // GET /search?q=something
         *     req.originalUrl
         *     // => "/search?q=something"
         *
         * In a middleware function, req.originalUrl is a combination of req.baseUrl and req.path, as shown in the following example.
         *
         *     app.use('/admin', function(req, res, next) {  // GET 'http://www.example.com/admin/new'
         *       console.log(req.originalUrl); // '/admin/new'
         *       console.log(req.baseUrl); // '/admin'
         *       console.log(req.path); // '/new'
         *       next();
         *     });
         *
         */
        originalUrl: string;

        /**
         * The URL path on which a router instance was mounted. The req.baseUrl property is similar
         * to the mountpath property of the app object, except app.mountpath returns the matched
         * path pattern(s).
         */
        baseUrl: string;

        /**
         * This property holds a reference to the instance of the Express application that is using
         * the middleware. If you follow the pattern in which you create a module that just exports
         * a middleware function and require() it in your main file, then the middleware can access
         * the Express instance via req.app
         */
        app: Application;

        /**
         * This property is an object containing properties mapped to the named route "parameters".
         * For example, if you have the route `/user/:name`, then the "name" property is available as `req.params.name`.
         * This object defaults to `{}`.
         * When you use a regular expression for the route definition, capture groups are provided in the array using
         * `req.params[n]`, where n is the nth capture group.
         * This rule is applied to unnamed wild card matches with string routes such as `/file/*`.
         */
        params: {
            [param: string]: string,
            [captureGroup: number]: string
        };

        /**
         * This property is an object containing properties mapped to body "parameters".
         */
        body: { [key:string]:any };

        /**
         * Return request header.
         *
         * The `Referrer` header field is special-cased,
         * both `Referrer` and `Referer` are interchangeable.
         *
         * Examples:
         *
         *     req.get('Content-Type');
         *     // => "text/plain"
         *
         *     req.get('content-type');
         *     // => "text/plain"
         *
         *     req.get('Something');
         *     // => undefined
         *
         * Aliased as `req.header()`.
         */
        get(name: string): string;

        header(name: string): string;

        /**
         * Check if the given `type(s)` is acceptable, returning
         * the best match when true, otherwise `undefined`, in which
         * case you should respond with 406 "Not Acceptable".
         *
         * The `type` value may be a single mime type string
         * such as "application/json", the extension name
         * such as "json", a comma-delimted list such as "json, html, text/plain",
         * or an array `["json", "html", "text/plain"]`. When a list
         * or array is given the _best_ match, if any is returned.
         *
         * Examples:
         *
         *     // Accept: text/html
         *     req.accepts('html');
         *     // => "html"
         *
         *     // Accept: text/*, application/json
         *     req.accepts('html');
         *     // => "html"
         *     req.accepts('text/html');
         *     // => "text/html"
         *     req.accepts('json, text');
         *     // => "json"
         *     req.accepts('application/json');
         *     // => "application/json"
         *
         *     // Accept: text/*, application/json
         *     req.accepts('image/png');
         *     req.accepts('png');
         *     // => undefined
         *
         *     // Accept: text/*;q=.5, application/json
         *     req.accepts(['html', 'json']);
         *     req.accepts('html, json');
         *     // => "json"
         */
        accepts(type: string | string[]): string | void;

        /**
         * Returns the first accepted charset of the specified character sets,
         * based on the request's Accept-Charset HTTP header field.
         * If none of the specified charsets is accepted, returns false.
         *
         * For more information, or if you have issues or concerns, see accepts.
         */
        acceptsCharsets(charset?: string | string[]): string | boolean;

        /**
         * Returns the first accepted encoding of the specified encodings,
         * based on the request’s Accept-Encoding HTTP header field.
         * If none of the specified encodings is accepted, returns false.
         *
         * For more information, or if you have issues or concerns, see accepts.
         */
        acceptsEncodings(encoding?: string | string[]): string | boolean;

        /**
         * Returns the first accepted language of the specified languages,
         * based on the request’s Accept-Language HTTP header field.
         * If none of the specified languages is accepted, returns false.
         *
         * For more information, or if you have issues or concerns, see accepts.
         */
        acceptsLanguages(lang?: string | string[]): string | boolean;

        /**
         * Parse Range header field,
         * capping to the given `size`.
         *
         * Unspecified ranges such as "0-" require
         * knowledge of your resource length. In
         * the case of a byte range this is of course
         * the total number of bytes. If the Range
         * header field is not given `null` is returned,
         * `-1` when unsatisfiable, `-2` when syntactically invalid.
         *
         * NOTE: remember that ranges are inclusive, so
         * for example "Range: users=0-3" should respond
         * with 4 users when available, not 3.
         */
        range(size: number, options?: RangeOptions): number | Range[];

        /**
         * @deprecated Use either req.params, req.body or req.query, as applicable.
         *
         * Return the value of param `name` when present or `defaultValue`.
         *
         *  - Checks route placeholders, ex: _/user/:id_
         *  - Checks body params, ex: id=12, {"id":12}
         *  - Checks query string params, ex: ?id=12
         *
         * To utilize request bodies, `req.body`
         * should be an object. This can be done by using
         * the `connect.bodyParser()` middleware.
         */
        param(name: string, defaultValue?: any): string;

        /**
         * Check if the incoming request contains the "Content-Type"
         * header field, and it contains the give mime `type`.
         *
         * Examples:
         *
         *      // With Content-Type: text/html; charset=utf-8
         *      req.is('html');
         *      req.is('text/html');
         *      req.is('text/*');
         *      // => true
         *
         *      // When Content-Type is application/json
         *      req.is('json');
         *      req.is('application/json');
         *      req.is('application/*');
         *      // => true
         *
         *      req.is('html');
         *      // => false
         */
        is(type: string | string[]): boolean;
    }
}

declare const req: req.Request;
export = req;
