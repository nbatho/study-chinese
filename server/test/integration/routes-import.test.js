import assert from 'node:assert/strict';
import test from 'node:test';

test('server route modules import successfully', async () => {
  const modules = await Promise.all([
    import('../../src/routes/api.routes.js'),
    import('../../src/routes/auth.routes.js'),
    import('../../src/routes/practice.routes.js'),
    import('../../src/routes/utility.routes.js')
  ]);

  modules.forEach((module) => {
    assert.equal(typeof module.default, 'function');
  });
});
