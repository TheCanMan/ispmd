// Hue retention: do photographs render in their own colours, or get repainted by the treatment?
// Compares each real slot's source JPEG (src/assets/media/real/) against its rendered region on the page.
// Fails if rendered hue spread < 85% of source, or the near-green share drifts more than 10 points.
import { chromium } from 'playwright'; import { PNG } from 'pngjs';
import { readFileSync, existsSync } from 'node:fs'; import { execSync } from 'node:child_process';
const PORT = process.env.PORT || 4399; const BASE = `http://localhost:${PORT}`;
const CHECKS = [['/enroll/','enroll-sunday'],['/program/','program-deen'],['/give/','give-impact'],['/our-story/','story-opening'],['/program/','program-between']];
const hsv=(r,g,b)=>{r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;let h=0;if(d){h=M===r?((g-b)/d)%6:M===g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360;}return {h,s:M?d/M:0,v:M}};
function stats(png,x0,y0,w,h){let n=0,g=0,sx=0,sy=0;for(let y=y0;y<y0+h;y+=2)for(let x=x0;x<x0+w;x+=2){if(x<0||y<0||x>=png.width||y>=png.height)continue;const i=(png.width*y+x)<<2;const {h:hh,s,v}=hsv(png.data[i],png.data[i+1],png.data[i+2]);if(s<0.15||v<0.15)continue;n++;if(Math.abs(((hh-120)+540)%360-180)<=25)g++;sx+=Math.cos(hh*Math.PI/180);sy+=Math.sin(hh*Math.PI/180);}return {green:n?g/n:0,spread:n?1-Math.hypot(sx,sy)/n:0}}
function sourcePng(base){ // decode the real JPEG via sips -> png (no extra deps)
  const jpg=`src/assets/media/real/${base}.jpg`; if(!existsSync(jpg)) return null;
  const tmp=`/tmp/measure-hue-${base}.png`; execSync(`sips -s format png "${jpg}" --out "${tmp}" >/dev/null 2>&1`); return PNG.sync.read(readFileSync(tmp));
}
const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
let fails=0; console.log('slot              spread src->render (keep>=85%)   near-green src->render (drift<=10pt)');
for(const [route,base] of CHECKS){
  const src=sourcePng(base); if(!src){console.log(`${base.padEnd(17)} (no real file - skipped)`);continue;}
  const S=stats(src,0,0,src.width,src.height);
  const p=await ctx.newPage(); await p.goto(BASE+route,{waitUntil:'networkidle'}); await p.waitForTimeout(2200);
  const box=await p.evaluate(h=>{const i=[...document.querySelectorAll('img')].find(i=>(i.currentSrc||i.src).includes(h));if(!i)return null;i.scrollIntoView({block:'center'});const r=i.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}},base);
  if(!box){console.log(`${base.padEnd(17)} (not rendered on ${route})`);await p.close();continue;}
  await p.waitForTimeout(500); const b2=await p.evaluate(h=>{const i=[...document.querySelectorAll('img')].find(i=>(i.currentSrc||i.src).includes(h));const r=i.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}},base);
  const png=PNG.sync.read(await p.screenshot()); const R=stats(png,Math.round(b2.x)+4,Math.round(b2.y)+4,Math.round(b2.w)-8,Math.round(b2.h)-8);
  const keep=S.spread?R.spread/S.spread:1; const drift=Math.abs(R.green-S.green)*100; const ok=keep>=0.85&&drift<=10; if(!ok)fails++;
  console.log(`${base.padEnd(17)} ${S.spread.toFixed(2)} -> ${R.spread.toFixed(2)} (${(100*keep).toFixed(0)}%)`.padEnd(48)+`${(100*S.green).toFixed(0)}% -> ${(100*R.green).toFixed(0)}%  ${ok?'ok':'*** FAIL'}`);
  await p.close();
}
await b.close(); if(fails){console.error(`measure:hue FAILED - ${fails} slot(s) repainted by the treatment`);process.exit(1);} console.log('measure:hue ok');
