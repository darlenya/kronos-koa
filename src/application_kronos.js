/* jslint node: true, esnext: true */
'use strict';

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
		this.composedMiddleware = compose(this.middleware);
		return this;
	}

	/**
	 * Overwrites the callback. This is now a dynamic callback.
	 * The returned function takes the changing generator chain
	 * instead of a fixed one.
	 */
	callback() {
		if (!this.listeners('error').length) this.on('error', this.onerror);

		this.composedMiddleware = compose(this.middleware);

		return (req, res) => {
			res.statusCode = 404;
			const ctx = this.createContext(req, res);
			onFinished(res, ctx.onerror);
			this.composedMiddleware(ctx).then(() => respond(ctx)).catch(ctx.onerror);
		};
	}


	/**
	 * Returns true if there is still registered middleware
	 * @return status True if there is still registered middleware
	 */
	hasMiddleware() {
		return this.middleware.length > 0;
	}

	/**
	 * Removes an existing generator function
	 * @param {GeneratorFunction} fn The generator function to be deleted
	 * @api public
	 */
	delete(fn) {
		const index = this.middleware.indexOf(fn);
		if (index >= 0) {
			this.middleware.splice(index, 1);
			this.composedMiddleware = compose(this.middleware);
		}
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
	if (!ctx.writable) return;

	let body = ctx.body;
	const code = ctx.status;

	// ignore body
	if (statuses.empty[code]) {
		// strip headers
		ctx.body = null;
		return res.end();
	}

	if ('HEAD' == ctx.method) {
		if (!res.headersSent && isJSON(body)) {
			ctx.length = Buffer.byteLength(JSON.stringify(body));
		}
		return res.end();
	}

	// status body
	if (null === body) {
		body = ctx.message || String(code);
		if (!res.headersSent) {
			ctx.type = 'text';
			ctx.length = Buffer.byteLength(body);
		}
		return res.end(body);
	}

	// responses
	if (body === undefined) return res.end();
	if (Buffer.isBuffer(body)) return res.end(body);
	if ('string' == typeof body) return res.end(body);
	if (body instanceof Stream) return body.pipe(res);

	// body: json
	body = JSON.stringify(body);
	if (!res.headersSent) {
		ctx.length = Buffer.byteLength(body);
	}
	res.end(body);
}

module.exports = ApplicationKronos;
