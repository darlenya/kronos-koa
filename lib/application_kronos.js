/* jslint node: true, esnext: true */
"use strict";

const compose = require('koa-compose');
const statuses = require('statuses');
const isJSON = require('koa-is-json');
const Stream = require('stream');
const onFinished = require('on-finished');

const Koa = require('koa');

class ApplicationKronos extends Koa {

	/**
	 * Overwrite the super function. It will update the middleware chain
	 */
	use(fn) {
		super.use(fn);
		this._updateAppCallback(); // Change for Kronos
		return this;
	}

	/**
	 * Overwrites the callback. This is now a dynamic callback.
	 * The returned function takes the changing generator chain
	 * instead of a fixed one.
	 */
	callback() {
		if (!this.listeners('error').length) this.on('error', this.onerror);

		return (req, res) => {
			res.statusCode = 404;
			const ctx = this.createContext(req, res);
			onFinished(res, ctx.onerror);
			this.generatorChain(ctx).then(() => respond(ctx)).catch(ctx.onerror);
		};
	}


	/**
	 * Returns true if there is still registered middleware
	 * @return status True if there is still registered middleware
	 */
	hasMiddleware() {
		if (this.middleware.length > 0) {
			return true;
		}
		return false;
	}

	/**
	 * Removes an existing generator function
	 * @param {GeneratorFunction} fn The generator function to be deleted
	 * @api public
	 */
	delete(fn) {
		var index = -1;
		for (var i = 0; i < this.middleware.length; i++) {
			if (this.middleware[i] === fn) {
				index = i;
				break;
			}
		}

		if (index >= 0) {
			this.middleware.splice(i, 1);
			this._updateAppCallback();
		}
	}

	/**
	 * Updates the middleware chain for the application callback.
	 * Used to add and remove generator function while the http server is running
	 *
	 * @api public
	 */
	_updateAppCallback() {
		this.generatorChain = compose(this.middleware);
	}
}

/**
 * Response helper.
 * copied from the original
 */

function respond(ctx) {
	// allow bypassing koa
	if (false === ctx.respond) return;

	const res = ctx.res;
	if (res.headersSent || !ctx.writable) return;

	let body = ctx.body;
	const code = ctx.status;

	// ignore body
	if (statuses.empty[code]) {
		// strip headers
		ctx.body = null;
		return res.end();
	}

	if ('HEAD' == ctx.method) {
		if (isJSON(body)) ctx.length = Buffer.byteLength(JSON.stringify(body));
		return res.end();
	}

	// status body
	if (null === body) {
		ctx.type = 'text';
		body = ctx.message || String(code);
		ctx.length = Buffer.byteLength(body);
		return res.end(body);
	}

	// responses
	if (Buffer.isBuffer(body)) return res.end(body);
	if ('string' == typeof body) return res.end(body);
	if (body instanceof Stream) return body.pipe(res);

	// body: json
	body = JSON.stringify(body);
	ctx.length = Buffer.byteLength(body);
	res.end(body);
}
module.exports = ApplicationKronos;
