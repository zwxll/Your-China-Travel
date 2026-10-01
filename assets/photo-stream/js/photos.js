export const LAYER = 128;
export const ATLAS_GRID = 4;

function decode(src) {
  return new Promise((res, rej) => { const img = new Image(); img.decoding = 'async'; img.onload = () => res(img); img.onerror = () => rej(new Error(`Could not load photo: ${src}`)); img.src = src; });
}
export async function loadTextures(gl, photos, onProgress) {
  const limit = gl.getParameter(gl.MAX_ARRAY_TEXTURE_LAYERS);
  const perSheet = ATLAS_GRID * ATLAS_GRID, sheets = Math.ceil(photos.length / perSheet);
  if (sheets > limit) throw new Error('照片数量超过当前设备的纹理容量，请通过照片目录浏览原图。');
  const arrTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, arrTex);
  gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1 + Math.log2(LAYER*ATLAS_GRID), gl.RGBA8, LAYER*ATLAS_GRID, LAYER*ATLAS_GRID, sheets);
  const scratch = document.createElement('canvas'); scratch.width = scratch.height = LAYER;
  const ctx = scratch.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  const tiny = document.createElement('canvas'); tiny.width = tiny.height = 8;
  const tctx = tiny.getContext('2d', { willReadFrequently: true });
  let done = 0;
  const queue = photos.map((_, i) => i);
  const worker = async () => {
    while (queue.length) {
      const i = queue.shift();
      const img = await decode(photos[i].src);
      photos[i].aspect = img.naturalWidth / img.naturalHeight;
      ctx.clearRect(0, 0, LAYER, LAYER);
      ctx.drawImage(img, 0, 0, LAYER, LAYER); // stretched to the square layer; the stream restores the aspect
      tctx.drawImage(scratch, 0, 0, 8, 8);
      const px = tctx.getImageData(0, 0, 8, 8).data; let r = 0, g = 0, b = 0;
      for (let j = 0; j < px.length; j += 4) { r += px[j]; g += px[j + 1]; b += px[j + 2]; }
      photos[i].avg = [r / 64 / 255, g / 64 / 255, b / 64 / 255];
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, arrTex);
      const tile = i % perSheet;
      gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, (tile % ATLAS_GRID)*LAYER, Math.floor(tile/ATLAS_GRID)*LAYER, Math.floor(i/perSheet), LAYER, LAYER, 1, gl.RGBA, gl.UNSIGNED_BYTE, scratch);
      onProgress(++done / photos.length);
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, arrTex);
  gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return arrTex;
}
