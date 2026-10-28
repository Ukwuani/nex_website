import fs from 'node:fs';
import path from 'node:path';
import { visuals, type VisualId } from '../data/visuals';
import { url as withBase } from './url';

const dir = path.join(process.cwd(), 'public', 'shots');

const exists = (file: string) => fs.existsSync(path.join(dir, file));
const url = (file: string) => withBase(`/shots/${file}`);

/** Width and height from a PNG's IHDR chunk, so images reserve their space. */
function pngSize(file: string) {
  const buf = fs.readFileSync(path.join(dir, file));
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** Looks up a visual and whichever of its files have been delivered. */
export function resolveVisual(id: VisualId) {
  const visual = visuals[id];
  if (visual.kind === 'image') {
    const light = exists(`${id}.png`) ? `${id}.png` : undefined;
    const dark = exists(`${id}-dark.png`) ? `${id}-dark.png` : undefined;
    return {
      visual,
      image: light && { src: url(light), dark: dark && url(dark), ...pngSize(light) },
      ready: Boolean(light),
    };
  }
  const webm = exists(`${id}.webm`) ? url(`${id}.webm`) : undefined;
  const mp4 = exists(`${id}.mp4`) ? url(`${id}.mp4`) : undefined;
  return {
    visual,
    video: (webm || mp4) && {
      webm,
      mp4,
      captions: exists(`${id}.vtt`) ? url(`${id}.vtt`) : undefined,
      poster: exists(`${id}-poster.png`) ? url(`${id}-poster.png`) : undefined,
    },
    ready: Boolean(webm || mp4),
  };
}
