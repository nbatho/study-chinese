import assert from 'node:assert/strict';
import test from 'node:test';
import { authSchemas, requireFields, validateBody, validators } from '../../src/middlewares/validate.middleware.js';

test('requireFields reports missing fields', () => {
  const middleware = requireFields(['email', 'password']);
  let error;

  middleware({ body: { email: 'learner@example.com' } }, {}, (nextError) => {
    error = nextError;
  });

  assert.equal(error.statusCode, 400);
  assert.deepEqual(error.details.missing, ['password']);
});

test('auth schema validates email and password shape', () => {
  assert.equal(validators.email('learner@example.com'), true);
  assert.equal(validators.email('bad-email'), false);
  assert.equal(authSchemas.register.password('12345678'), true);
  assert.equal(authSchemas.register.password('short'), false);
});

test('validateBody passes valid payloads and rejects invalid payloads', () => {
  const middleware = validateBody(authSchemas.login);
  const errors = [];

  middleware({ body: { email: 'learner@example.com', password: 'secret' } }, {}, (error) => {
    errors.push(error);
  });
  middleware({ body: { email: 'bad', password: '' } }, {}, (error) => {
    errors.push(error);
  });

  assert.equal(errors[0], undefined);
  assert.equal(errors[1].statusCode, 400);
  assert.equal(errors[1].details.fields.email, 'Invalid value.');
});
