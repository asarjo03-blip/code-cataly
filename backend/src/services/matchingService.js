const REGION_NEIGHBOURS = {
  banjul: ['kanifing', 'west_coast'],
  kanifing: ['banjul', 'west_coast'],
  west_coast: ['kanifing', 'banjul', 'lower_river', 'north_bank'],
  north_bank: ['west_coast', 'central_river_north', 'lower_river'],
  lower_river: ['west_coast', 'north_bank', 'central_river_south'],
  central_river_north: ['north_bank', 'central_river_south', 'upper_river'],
  central_river_south: ['lower_river', 'central_river_north', 'upper_river'],
  upper_river: ['central_river_north', 'central_river_south'],
};

export function regionProximity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 30;
  if (REGION_NEIGHBOURS[a]?.includes(b)) return 15;
  return 0;
}

export function matchListingToRequest(listing, request) {
  if (!listing || !request) return null;
  if (listing.crop !== request.crop) return null;
  if (listing.status && listing.status !== 'open') return null;
  if (request.status && request.status !== 'open') return null;
  if ((listing.unit || 'kg') !== (request.unit || 'kg')) return null;

  const quantityGap =
    Math.abs(Number(listing.quantity) - Number(request.quantity)) /
    Math.max(Number(listing.quantity), Number(request.quantity), 1);
  const quantityScore = Math.round((1 - Math.min(1, quantityGap)) * 25);
  const asking = Number(listing.askingPrice);
  const offer = Number(request.offerPrice);
  const priceScore = offer >= asking ? 20 : Math.max(0, 20 - Math.round(((asking - offer) / asking) * 20));
  const proximity = regionProximity(listing.region, request.region);
  const score = proximity + quantityScore + priceScore;

  return {
    score,
    regionScore: proximity,
    quantityScore,
    priceScore,
    crop: listing.crop,
    listingId: listing.id || String(listing._id || ''),
    requestId: request.id || String(request._id || ''),
    listing,
    request,
    reasons: [
      proximity >= 30 ? 'Same region' : proximity > 0 ? 'Nearby region' : 'Different region',
      offer >= asking ? 'Offer meets asking price' : 'Offer below asking price',
    ],
  };
}

export function rankMatches({ listings = [], requests = [], crop, region } = {}) {
  const matches = [];
  for (const listing of listings) {
    if (crop && listing.crop !== crop) continue;
    if (region && listing.region !== region && !REGION_NEIGHBOURS[region]?.includes(listing.region)) continue;
    for (const request of requests) {
      const match = matchListingToRequest(listing, request);
      if (match) matches.push(match);
    }
  }
  return matches
    .sort(
      (a, b) =>
        b.regionScore - a.regionScore ||
        b.priceScore - a.priceScore ||
        b.quantityScore - a.quantityScore,
    )
    .slice(0, 20);
}
