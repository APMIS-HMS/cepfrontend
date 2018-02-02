const assert = require('assert');
const app = require('../../src/app');

describe('\'wardroomgroups\' service', () => {
  it('registered the service', () => {
    const service = app.service('wardroomgroups');

    assert.ok(service, 'Registered the service');
  });
});
