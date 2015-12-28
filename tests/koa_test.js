/* global describe, it, beforeEach */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const route = require('koa-route');
const http = require('http');

const KronosKoa = require('../lib/application_kronos');
const koaRoute = require('koa-route');

const PORT = 8199;

describe('Test dynamic add and remove of routes', function () {
	const app = new KronosKoa();
	const httpServer = http.createServer(app.callback());

	// Add a route before the server is started
	const firstRoute = koaRoute.get('/state', genericDemoHandler("My res 1"));
	app.use(firstRoute);
	app.listen(PORT);

	it('test route static', function (done) {
		chai.request('http://localhost:' + PORT)
			.get('/state')
			.then(function (response) {
				expect(response).to.have.status(200);
				expect(response.text).to.equal("My res 1");
				done();
			})
			.catch(function (err) {
				done(err);
			});
	});

	it('test add new route', function (done) {
		app.use(koaRoute.get('/dynamic', genericDemoHandler("My dynamic 1")));
		chai.request('http://localhost:' + PORT)
			.get('/dynamic')
			.then(function (response) {
				expect(response).to.have.status(200);
				expect(response.text).to.equal("My dynamic 1");
				done();
			})
			.catch(function (err) {
				done(err);
			});
	});

	it('test remove first route', function (done) {
		app.delete(firstRoute);

		app.use(koaRoute.get('/dynamic', genericDemoHandler("My dynamic 1")));
		chai.request('http://localhost:' + PORT)
			.get('/state')
			.then(function (response) {
				expect(response).to.have.status(404);
				done();
			})
			.catch(function (err) {
				done(err);
			});
	});


});

function genericDemoHandler(staticResponse) {
	return (ctx) => {
		const data = ctx.request;
		ctx.body = staticResponse;
	};
}
