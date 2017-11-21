import { KronosKoa } from '../src/kronos-koa';
import test from 'ava';
import got from 'got';

const route = require('koa-route');
const http = require('http');
const koaRoute = require('koa-route');

const PORT = 8199;

function makeServer(port = PORT) {
  const app = new KronosKoa();
  const server = http.createServer(app.callback());

  // Add a route before the server is started
  const route = koaRoute.get('/state', genericDemoHandler('My res 1'));
  app.use(route);
  app.listen(port);

  return { app, route, server };
}

test('Test dynamic add and remove of routes route static', async t => {
  const { server } = makeServer(PORT + 1);

  const response = await got(`http://localhost:${PORT + 1}/state`);
  t.is(response.body, 'My res 1');
});

test('Test dynamic add and remove of routes add new route', async t => {
  const { server, app } = makeServer(PORT + 2);

  app.use(koaRoute.get('/dynamic', genericDemoHandler('My dynamic 1')));

  const response = await got(`http://localhost:${PORT + 2}/dynamic`);
  t.is(response.body, 'My dynamic 1');
});

test('Test dynamic add and remove of routes remove first route', async t => {
  const { server, app, route } = makeServer(PORT + 3);

  app.delete(route);

  app.use(koaRoute.get('/dynamic', genericDemoHandler('My dynamic 1')));

  try {
    const response = await got(`http://localhost:${PORT + 3}/state`);
    t.is(response.statusCode, 404);
  } catch (response) {
    t.is(response.statusCode, 404);
  }
});

function genericDemoHandler(staticResponse) {
  return ctx => {
    const data = ctx.request;
    ctx.body = staticResponse;
  };
}
