export const MAX_BYTES = 12 * 1024 * 1024;
export const validId = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const text = (value, max) => String(value || '').slice(0, max);
const image = value => {
  if (!value) return '';
  if (typeof value !== 'string' || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value) || value.length > 400000) {
    throw new Error('照片格式或大小不符合分享要求');
  }
  return value;
};

export function sanitizeSnapshot(value) {
  if (!value || !Array.isArray(value.provinces) || !value.provinces.length || value.provinces.length > 34) throw new Error('书架内容无效');
  let photoCount = 0, cityCount = 0;
  const provinces = value.provinces.map(province => {
    if (!Array.isArray(province.cities) || !province.cities.length) throw new Error('城市章节无效');
    const cities = province.cities.map(city => {
      cityCount++;
      if (!Array.isArray(city.photos)) throw new Error('照片列表无效');
      const photos = city.photos.map(photo => {
        if (photo.kind === 'video') throw new Error('分享书架暂不包含视频');
        photoCount++;
        return {dataUrl: image(photo.dataUrl), name: text(photo.name, 80)};
      });
      if (photos.some(photo => !photo.dataUrl)) throw new Error('分享照片不能为空');
      return {name:text(city.name,60),description:text(city.description,1000),firstMonth:text(city.firstMonth,10),photos};
    });
    return {name:text(province.name,60),review:text(province.review,180),cover:image(province.cover),cities};
  });
  if (!photoCount || photoCount > 1500 || cityCount > 400) throw new Error('照片数量需在 1–1500 张之间，城市不能超过 400 座');
  const snapshot = {version:1,provinces};
  if (new TextEncoder().encode(JSON.stringify(snapshot)).length > MAX_BYTES) throw new Error('分享内容超过 12MB，请减少照片或降低图片大小');
  return snapshot;
}
