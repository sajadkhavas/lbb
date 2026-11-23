const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync('src/hooks/use-idle-autoplay.ts', 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function test(delay) {
  let time=0, next=0, count=0, cleanup;
  const timers=new Map();
  const node=new EventTarget(); node.closest=()=>null;
  const doc=new EventTarget(); doc.hidden=false;
  const motion=new EventTarget(); motion.matches=false;
  const win=new EventTarget(); win.matchMedia=()=>motion;
  const module={exports:{}};
  const context={exports:module.exports, require:()=>({useRef:(initial)=>({current:initial===null?node:initial}),useState:()=>[true,()=>{}],useEffect:(fn)=>{const result=fn(); if(result) cleanup=result;}}), window:win, document:doc, IntersectionObserver:class {observe(){} disconnect(){}},setTimeout:(fn,ms)=>{timers.set(++next,{fn,at:time+ms});return next;},clearTimeout:id=>timers.delete(id)};
  vm.runInNewContext(source,context);
  module.exports.useIdleAutoplay(()=>count++,delay);
  function tick(ms){const end=time+ms;while(true){const found=[...timers].sort((a,b)=>a[1].at-b[1].at)[0];if(!found||found[1].at>end)break;time=found[1].at;timers.delete(found[0]);found[1].fn();}time=end;}
  tick(delay-1);assert.equal(count,0);tick(1);assert.equal(count,1);
  node.dispatchEvent(new Event('pointerdown'));tick(delay*2);assert.equal(count,1,'held pointer must pause');
  win.dispatchEvent(new Event('pointerup'));tick(2999);assert.equal(count,1);tick(1);assert.equal(count,2,'resume at 3 seconds');
  node.dispatchEvent(new Event('pointermove'));tick(2000);node.dispatchEvent(new Event('pointermove'));tick(2999);assert.equal(count,2);tick(1);assert.equal(count,3,'activity resets idle clock');
  doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));tick(delay*3);assert.equal(count,3);
  doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));tick(delay);assert.equal(count,4);
  motion.matches=true;motion.dispatchEvent(new Event('change'));tick(delay*2);assert.equal(count,4);
  cleanup();assert.equal(timers.size,0);
  console.log(`PASS ${delay}ms: interval, hold, idle restart, repeated interaction, hidden tab, reduced motion, cleanup`);
}
test(3000);test(5500);
