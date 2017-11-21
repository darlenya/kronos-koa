import { KronosKoa } from '../src/kronos-koa';
import test from 'ava';
import got from 'got';

const route = require('koa-route');
const http = require('http');
const koaRoute = require('koa-route');

const PORT = 8199;

test('Test dynamic add and remove of routes test route static', async t => {
  const app = new KronosKoa();
  const httpServer = http.createServer(app.callback());

  // Add a route before the server is started
  const firstRoute = koaRoute.get('/state', genericDemoHandler('My res 1'));
  app.use(firstRoute);
  app.listen(PORT);

  const response = await got(`http://localhost:${PORT}/state`);
  t.is(response.body, 'My res 1');

  /*
  console.log(response);
  t.is(response.status, 200);
*/
  /*
  chai
    .request('http://localhost:' + PORT)
    .get('/state')
    .then(response => {
      expect(response).to.have.status(200);
      expect(response.text).to.equal('My res 1');
      done();
    })
    .catch(function(err) {
      done(err);
    });

    */
});

/*
describe('Test dynamic add and remove of routes', () => {
  it('test route static', done => {
    chai
      .request('http://localhost:' + PORT)
      .get('/state')
      .then(response => {
        expect(response).to.have.status(200);
        expect(response.text).to.equal('My res 1');
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('test add new route', done => {
    app.use(koaRoute.get('/dynamic', genericDemoHandler('My dynamic 1')));
    chai
      .request('http://localhost:' + PORT)
      .get('/dynamic')
      .then(response => {
        expect(response).to.have.status(200);
        expect(response.text).to.equal('My dynamic 1');
        done();
      })
      .catch(err => done(err));
  });

  it('test remove first route', done => {
    app.delete(firstRoute);

    app.use(koaRoute.get('/dynamic', genericDemoHandler('My dynamic 1')));
    chai
      .request('http://localhost:' + PORT)
      .get('/state')
      .then(response => {
        expect(response).to.have.status(404);
        done();
      })
      .catch(err => done(err));
  });
});
*/

function genericDemoHandler(staticResponse) {
  return ctx => {
    const data = ctx.request;
    ctx.body = staticResponse;
  };
}
