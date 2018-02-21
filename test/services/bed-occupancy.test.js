const assert = require('assert');
const app = require('../../src/app');

describe('\'bedOccupancy\' service', () => {
    it('registered the service', () => {
        const service = app.service('bed-occupancy');

        assert.ok(service, 'Registered the service');
    });
});
