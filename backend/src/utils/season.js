export function getGambiaSeason(date = new Date()) {
  const month = date.getUTCMonth() + 1;
  if (month >= 6 && month <= 10) {
    return 'rainy';
  }
  return 'dry';
}

export function getSeasonPhase(date = new Date()) {
  const month = date.getUTCMonth() + 1;
  const season = getGambiaSeason(date);

  if (season === 'rainy') {
    if (month === 6) return { season, phase: 'onset', label: 'Rainy season onset' };
    if (month === 10) return { season, phase: 'late', label: 'Late rains / harvest window' };
    return { season, phase: 'peak', label: 'Peak rainy season' };
  }

  if (month === 11 || month === 12) {
    return { season, phase: 'harvest', label: 'Post-rain harvest and storage' };
  }
  if (month <= 3) {
    return { season, phase: 'harmattan', label: 'Cool dry / harmattan' };
  }
  return { season, phase: 'hot', label: 'Hot dry season' };
}
