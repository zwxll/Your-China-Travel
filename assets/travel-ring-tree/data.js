// Read-only catalog from the same city records as the year atlas.
export function createTreeCatalog(records) {
  const cities = new Map(), photos = [], seen = new Set();
  for (const record of records) {
    if (seen.has(record.id) || record.kind === 'video' || !record.src) continue;
    seen.add(record.id);
    const key = record.cityKey || record.id.slice(0, record.id.lastIndexOf(':')) || record.title;
    if (!cities.has(key)) cities.set(key, { id: key, title: record.title, color: '#869c74', photos: [] });
    const city = cities.get(key);
    const photo = { ...record, description: record.title, aspect: 1 / (record.aspect || 4 / 3),
      year: Number.isInteger(record.year) ? record.year : '年份未确定',
      thumb: record.src, story: city, indexInStory: city.photos.length };
    city.photos.push(photo); photos.push(photo);
  }
  return { photos, cities: [...cities.values()], years: [...new Set(photos.map(p => p.year).filter(Number.isInteger))].sort((a, b) => a - b) };
}
