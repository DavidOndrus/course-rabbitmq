/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/

    order: [
      'requestLogger',
      'securityHeaders',
      'cookieParser',
      'session',
      'bodyParser',
      'compress',
      'poweredBy',
      'router',
      'www',
      'favicon',
    ],

    requestLogger: (function() {
      return function (req, res, next) {
        sails.log.info(`${new Date().toISOString()} ${req.method} ${req.path}`);
        return next();
      };
    })(),

    securityHeaders: (function() {
      return function (req, res, next) {
        const appName = req.headers['x-app-name'];
        const appVersion = req.headers['x-app-version'];

        if (!appName || !appVersion) {
          return res.status(403).send('Access denied: Missing identification headers');
        }

        if (appName !== 'frontend') {
          return res.status(403).send('Access denied: Invalid app name');
        }

        return next();
      };
    })(),


    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/

    // bodyParser: (function _configureBodyParser(){
    //   var skipper = require('skipper');
    //   var middlewareFn = skipper({ strict: true });
    //   return middlewareFn;
    // })(),

  },

};
