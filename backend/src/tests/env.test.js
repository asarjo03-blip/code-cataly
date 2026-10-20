import test from 'node:test';
import assert from 'node:assert/strict';
import { loadEnv } from '../config/env.js';

const keys = ['NODE_ENV', 'DATABASE_URL', 'MONGODB_URI', 'MONGO_URI', 'JWT_SECRET'];

function withEnv(values, callback) {
  const previous = new Map(keys.map((key) => [key, process.env[key]]));

  for (const key of keys) {
    delete process.env[key];
  }
  Object.assign(process.env, values);

  try {
    callback();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('production accepts each supported MongoDB connection variable', () => {
  for (const key of ['DATABASE_URL', 'MONGODB_URI', 'MONGO_URI']) {
    withEnv({ NODE_ENV: 'production', JWT_SECRET: 'test-secret', [key]: 'mongodb://example/db' }, () => {
      assert.equal(loadEnv().databaseUrl, 'mongodb://example/db');
    });
  }
});

test('production requires a MongoDB connection variable', () => {
  withEnv({ NODE_ENV: 'production', JWT_SECRET: 'test-secret' }, () => {
    assert.throws(() => loadEnv(), /DATABASE_URL \(or MONGODB_URI\/MONGO_URI\)/);
  });
});
