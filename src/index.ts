import {MiallergieApiBackApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {MiallergieApiBackApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new MiallergieApiBackApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
