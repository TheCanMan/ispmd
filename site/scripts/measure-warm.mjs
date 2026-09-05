// Warm-hue scan: fraction of UI pixels (photos/video masked) whose HSV hue is orange/yellow/brown.
// Enforces the no-warm-colour rule at the pixel level, which token/literal guards cannot see (gradients, shaders, blends).
import { chromium } from 'playwright'; import { PNG } from 'pngjs';
import { readFileSync } from 'node:fs';
const PORT = process.env.PORT || 4399; const BASE = `http://localhost:${PORT}`;
const ROUTES = ['/','/our-story/','/program/','/calendar/','/enroll/','/faqs/','/give/','/contact/'];
const hsv=(r,g,b)=>{r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;let h=0;
  if(d){h=M===r?((g-b)/d)%6:M===g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360;} return {h,s:M?d/M:0,v:M};};
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce' });
await ctx.addInitScript(()=>Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8}));
let worst = 0;
for (const r of ROUTES) {
  const p = await ctx.newPage(); await p.goto(BASE + r, { waitUntil:'networkidle' }); await p.waitForTimeout(2500);
  const boxes = await p.evaluate(()=>[...document.querySelectorAll('img,video,picture')].map(e=>{const r=e.getBoundingClientRect();return [Math.floor(r.x),Math.floor(r.y+scrollY),Math.ceil(r.width),Math.ceil(r.height)]}).filter(x=>x[2]>0&&x[3]>0));
  const png = PNG.sync.read(await p.screenshot({ fullPage:true }));
  const masked = new Uint8Array(png.width*png.height);
  for (const [x,y,w,h] of boxes) for (let yy=Math.max(0,y); yy<Math.min(png.height,y+h); yy++) for (let xx=Math.max(0,x); xx<Math.min(png.width,x+w); xx++) masked[yy*png.width+xx]=1;
  let warm=0,total=0; const N=png.width*png.height;
  for (let i=0;i<N;i+=3){ if(masked[i]) continue; const o=i<<2; const {h,s,v}=hsv(png.data[o],png.data[o+1],png.data[o+2]); total++; if(s>0.22&&v>0.25&&h>=12&&h<=65) warm++; }
  const pct=100*warm/total; worst=Math.max(worst,pct);
  console.log(`${r.padEnd(13)} warm UI pixels: ${pct.toFixed(2)}%  [${boxes.length} media regions masked]`);
  await p.close();
}
await b.close();
console.log(`worst: ${worst.toFixed(2)}%`);
if (worst >= 0.5) { console.error('measure:warm FAILED - warm hue present'); process.exit(1); }
