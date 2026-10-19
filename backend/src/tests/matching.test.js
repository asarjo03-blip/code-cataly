import test from 'node:test';
import assert from 'node:assert/strict';
import { matchListingToRequest, rankMatches } from '../services/matchingService.js';

test('matches the same crop in the same region ahead of distant offers', () => {
  const listing = { id: 'l1', crop: 'groundnut', quantity: 500, askingPrice: 46, region: 'north_bank', status: 'open' };
  const local = { id: 'r1', crop: 'groundnut', quantity: 400, offerPrice: 47, region: 'north_bank', status: 'open' };
  const far = { id: 'r2', crop: 'groundnut', quantity: 400, offerPrice: 50, region: 'upper_river', status: 'open' };
  const ranked = rankMatches({ listings: [listing], requests: [far, local] });
  assert.equal(ranked[0].requestId, 'r1');
  assert.ok(ranked[0].score > ranked[1].score);
});

test('does not match different crops', () => {
  const match = matchListingToRequest(
    { crop: 'onion', quantity: 10, askingPrice: 40, region: 'kanifing', status: 'open' },
    { crop: 'tomato', quantity: 10, offerPrice: 40, region: 'kanifing', status: 'open' },
  );
  assert.equal(match, null);
});

test('does not match quantities expressed in different units', () => {
  const match = matchListingToRequest(
    { crop: 'groundnut', quantity: 10, unit: 'bag', askingPrice: 40, region: 'kanifing' },
    { crop: 'groundnut', quantity: 10, unit: 'kg', offerPrice: 40, region: 'kanifing' },
  );
  assert.equal(match, null);
});

test('prioritizes region proximity before price and quantity fit', () => {
  const local = {
    id: 'local',
    crop: 'groundnut',
    quantity: 100,
    askingPrice: 100,
    region: 'north_bank',
  };
  const requests = [
    {
      id: 'far',
      crop: 'groundnut',
      quantity: 100,
      offerPrice: 100,
      region: 'upper_river',
    },
    {
      id: 'near',
      crop: 'groundnut',
      quantity: 1,
      offerPrice: 1,
      region: 'north_bank',
    },
  ];
  const ranked = rankMatches({ listings: [local], requests });
  assert.equal(ranked[0].requestId, 'near');
});
