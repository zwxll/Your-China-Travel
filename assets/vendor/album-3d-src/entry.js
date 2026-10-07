// Entry for the album 3D vendor bundle. The city photo album reader in
// index.html consumes window.Album3DReader; nothing here may touch
// window.THREE — the memory bookshelf loads its own three@0.149 UMD global.
import { createAlbum3DReader } from "./reader.js";

export { createAlbum3DReader };
