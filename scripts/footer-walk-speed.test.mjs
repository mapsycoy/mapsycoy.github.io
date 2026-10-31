import test from 'node:test';
import assert from 'node:assert/strict';
import {FooterAIWorld} from '../src/utils/footer-sketch.ts';
const random=()=>.37;
function firstWalk(speed=1){const w=new FooterAIWorld(random,960);w.setWalkSpeed(speed);for(let i=0;i<1000&&w.phase!=='walk';i++)w.update(50);assert.equal(w.phase,'walk');return w}
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('half walking speed doubles traversal duration without changing destination, steps or lean',()=>{
 const a=firstWalk().snapshot(),b=firstWalk(.5).snapshot();
 close(b.walk.duration,a.walk.duration*2);assert.equal(b.walk.steps,a.walk.steps);assert.equal(b.walk.to,a.walk.to);assert.equal(b.walk.from,a.walk.from);assert.equal(b.walk.lean,a.walk.lean);
 assert.ok(b.walk.duration/b.walk.steps>=660&&b.walk.duration/b.walk.steps<=880);
});
test('an active legacy walk resumes more slowly without a position or pose jump',()=>{
 const base=firstWalk();for(let i=0;i<25;i++)base.update(50);const legacy=base.snapshot();delete legacy.walk.speed;
 const slow=FooterAIWorld.fromSnapshot(legacy,960,random);const before=slow.snapshot();slow.setWalkSpeed(.5);const after=slow.snapshot();
 for(const key of ['x','angle','antenna','gaze','turn','blink','time'])close(after[key],before[key]);
 assert.deepEqual(after.garden,before.garden);close(after.end-after.time,(before.end-before.time)*2);assert.ok(after.start>=0);
 assert.ok(FooterAIWorld.fromSnapshot(after,960,random));
 slow.update(100);assert.ok(Math.abs(slow.snapshot().x-after.x)<.02);
});
test('late-walk changes remain valid and repeated same-speed restores are idempotent',()=>{
 const w=firstWalk();while(w.snapshot().end-w.time>150)w.update(50);w.setWalkSpeed(.5);const saved=w.snapshot();
 assert.ok(saved.start>=0);const restored=FooterAIWorld.fromSnapshot(saved,960,random);assert.ok(restored);restored.setWalkSpeed(.5);assert.deepEqual(restored.snapshot(),saved);
 restored.setWalkSpeed(1);close(restored.snapshot().end-restored.time,(saved.end-saved.time)/2);close(restored.snapshot().x,saved.x);
});
test('rest, blink and look clocks are unchanged outside walking',()=>{
 const normal=new FooterAIWorld(random,960),slow=new FooterAIWorld(random,960);slow.setWalkSpeed(.5);
 for(let i=0;i<10;i++){normal.update(50);slow.update(50)}assert.deepEqual(slow.snapshot(),normal.snapshot());
});
test('planting and flower growth retain their original timing',()=>{
 const w=new FooterAIWorld(random,960);for(let i=0;i<30000&&w.phase!=='grow';i++)w.update(50);assert.equal(w.phase,'grow');
 const a=FooterAIWorld.fromSnapshot(w.snapshot(),960,random),b=FooterAIWorld.fromSnapshot(w.snapshot(),960,random);b.setWalkSpeed(.5);
 for(let i=0;i<80;i++){a.update(50);b.update(50)}assert.deepEqual(a.snapshot(),b.snapshot());assert.ok(b.garden[0].growth>0);
});
test('invalid speed/progress snapshot metadata is rejected, old metadata remains optional',()=>{
 const s=firstWalk().snapshot();assert.equal(FooterAIWorld.fromSnapshot({...s,walk:{...s.walk,speed:0}},960),undefined);
 assert.equal(FooterAIWorld.fromSnapshot({...s,walk:{...s.walk,progressStart:1}},960),undefined);
 delete s.walk.speed;assert.ok(FooterAIWorld.fromSnapshot(s,960));
});
