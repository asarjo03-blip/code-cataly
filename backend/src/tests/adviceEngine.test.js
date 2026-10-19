import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAdvice } from '../services/adviceEngine.js';

test('calendar and weather rules produce crop-specific advice', () => {
  const advice = generateAdvice({
    region: 'north_bank',
    crops: ['groundnut'],
    farmingType: 'rainfed',
    weather: {
      current: { tempC: 34, rainMm: 14 },
      forecast: [
        { rainMm: 16 },
        { rainMm: 14 },
        { rainMm: 13 },
        { rainMm: 0 },
        { rainMm: 0 },
      ],
      alerts: [{ severity: 'warning', code: 'heavy_rain', message: 'Heavy rain likely.' }],
    },
  });
  assert.ok(advice.length > 0);
  assert.ok(advice.some((item) => item.crop === 'groundnut' || item.tags?.includes('weather')));
});
