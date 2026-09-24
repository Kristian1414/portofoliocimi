// Creates small WebP versions of every JPG in public/works for the grids
// (hero, about, gallery). The full-size files are only loaded in the lightbox.
// Requires ffmpeg on the PATH. Run with: npm run thumbs
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const WIDTH = 800;
const src = path.join(__dirname, '..', 'public', 'works');
const out = path.join(src, 'thumbs');
fs.mkdirSync(out, { recursive: true });

for (const file of fs.readdirSync(src).filter((f) => f.endsWith('.jpg'))) {
  const target = path.join(out, file.replace(/\.jpg$/, '.webp'));
  if (fs.existsSync(target)) continue;
  execFileSync('ffmpeg', [
    '-loglevel', 'error',
    '-i', path.join(src, file),
    '-vf', `scale='min(${WIDTH},iw)':-2`,
    '-c:v', 'libwebp',
    '-quality', '78',
    target,
  ]);
  console.log('thumb', file);
}
