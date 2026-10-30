type Phase = "rest" | "walk" | "settle" | "look" | "greet" | "plant-look" | "plant" | "grow" | "admire";
type Message = "step" | "spaces" | "radiant";
type Variant = 0 | 1 | 2;
type Flower = { slot: number; x: number; growth: number; variant: Variant };
export const MAX_FLOWERS = 40;
const LEGACY_SLOT_SPAN = 9;
const speechTime: Record<Message, number> = { step: 4800, spaces: 5600, radiant: 5500 };
export const flowerForms = [
  { stem: 'M0 0Q2-6 .5-12T1-20', leaves: [{ at: .34, direction: -1, length: 7, rise: 5, width: 6 }, { at: .64, direction: 1, length: 7, rise: 5, width: 6 }] },
  { stem: 'M0 0Q-1-8-2-17Q-3-24-1-30', leaves: [{ at: .25, direction: -1, length: 8, rise: 7, width: 2.5 }, { at: .48, direction: 1, length: 8, rise: 7, width: 2.5 }, { at: .72, direction: -1, length: 7, rise: 7, width: 2.5 }] },
  { stem: 'M0 0Q3-7 2-13Q1-18 3-23', leaves: [{ at: .42, direction: 1, length: 9, rise: 3.5, width: 8 }] },
] as const;
type Walk = { from: number; to: number; steps: number; duration: number; lean: number; planting: boolean };
type Snapshot = {
  version: 2; x: number; time: number; phase: Phase; angle: number; antenna: number; gaze: number; turn: number; blink: number;
  greeting: Message; speechMuted?: boolean; completed: number; greetings: number; planted: number;
  garden: Flower[]; targetSlot: number | null; targetX?: number | null;
  seed: { visible: boolean; y: number };
  start: number; end: number; walk: Walk | null; accumulator: number; antennaVelocity: number;
  nextBlink: number; blinkEnd: number; nextSpeech: number; restSpeechAt: number | null;
  nextPlant: number; planting: boolean; walksSincePlant: number; lookDirection: number; growTalk: boolean; growthWait?: number;
};
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const ease = (n: number) => n * n * (3 - 2 * n);
const MARGIN = 64;

function validSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== 'object') return false;
  const s = value as Snapshot;
  const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);
  const unit = (n: unknown) => finite(n) && n >= 0 && n <= 1;
  const count = (n: unknown) => finite(n) && Number.isInteger(n) && n >= 0;
  if (s.version !== 2 || !unit(s.x) || !['rest', 'walk', 'settle', 'look', 'greet', 'plant-look', 'plant', 'grow', 'admire'].includes(s.phase)) return false;
  if (!['legs', 'step', 'spaces', 'shade', 'beauty', 'gardener', 'shadows', 'radiant'].includes(s.greeting)) return false;
  if (s.speechMuted !== undefined && typeof s.speechMuted !== 'boolean') return false;
  if (![s.time, s.start, s.end, s.nextBlink, s.blinkEnd, s.nextSpeech, s.nextPlant].every(n => finite(n) && n >= 0)) return false;
  if (s.start > s.time || s.end <= s.time || s.end <= s.start) return false;
  if (![s.angle, s.antenna, s.gaze, s.turn, s.blink, s.accumulator, s.antennaVelocity].every(finite)) return false;
  if (Math.abs(s.angle) > 20 || Math.abs(s.turn) > 1 || !unit(s.blink) || s.accumulator < 0 || s.accumulator > 1 / 120 + 1e-6) return false;
  if (![s.completed, s.greetings, s.planted, s.walksSincePlant].every(count)) return false;
  if (![s.planting, s.growTalk].every(n => typeof n === 'boolean') || ![-1, 1].includes(s.lookDirection)) return false;
  if (s.restSpeechAt !== null && (!finite(s.restSpeechAt) || s.restSpeechAt < 0)) return false;
  if (s.growthWait !== undefined && (!finite(s.growthWait) || s.growthWait < 0 || s.growthWait > 10000)) return false;
  if (!Array.isArray(s.garden) || s.garden.length > MAX_FLOWERS || s.garden.some(f => !f || !count(f.slot) || f.slot >= MAX_FLOWERS || !unit(f.growth))) return false;
  if (s.garden.some(f => f.variant !== undefined && ![0, 1, 2].includes(f.variant))) return false;
  if (s.garden.some(f => f.x !== undefined && !unit(f.x))) return false;
  if (s.garden.some(f => f.x === undefined && f.slot > LEGACY_SLOT_SPAN)) return false;
  if (new Set(s.garden.map(f => f.slot)).size !== s.garden.length) return false;
  if (s.targetSlot !== null && (!count(s.targetSlot) || s.targetSlot >= MAX_FLOWERS)) return false;
  if (s.targetX !== undefined && s.targetX !== null && !unit(s.targetX)) return false;
  if (['plant-look', 'plant', 'grow', 'admire'].includes(s.phase) && s.targetSlot === null) return false;
  if (s.phase === 'grow' && !s.garden.some(f => f.slot === s.targetSlot)) return false;
  if (!s.seed || typeof s.seed.visible !== 'boolean' || !finite(s.seed.y)) return false;
  if ((s.phase === 'walk') !== (s.walk !== null)) return false;
  if (s.walk && (!unit(s.walk.from) || !unit(s.walk.to) || !count(s.walk.steps) || s.walk.steps < 2 || !finite(s.walk.duration) || s.walk.duration <= 0 || !finite(s.walk.lean) || typeof s.walk.planting !== 'boolean')) return false;
  return true;
}

export function aiProjection(turn: number) {
  const yaw = turn * .55, sine = Math.sin(yaw);
  return { sx: Math.cos(yaw), skew: sine * .08, shift: sine * 3, dx: -sine * 14, dy: -Math.abs(sine) * 3 };
}

// Leaves unfold only after the stem tip has passed their attachment points.
// The bud waits for the complete stem; petals open after both leaves and bud.
export function flowerStages(growth: number) {
  const stem = clamp(growth / .6, 0, 1);
  return {
    stem,
    left: ease(clamp((stem - .4) / .3, 0, 1)),
    right: ease(clamp((stem - .7) / .3, 0, 1)),
    bud: ease(clamp((growth - .6) / .14, 0, 1)),
    petals: ease(clamp((growth - .76) / .24, 0, 1)),
  };
}
export function leafOpening(stem: number, attachment: number) {
  const start = attachment + .05;
  return ease(clamp((stem - start) / Math.min(.25, 1 - start), 0, 1));
}

// One small visitor, with a new destination and rest sampled for each outing.
// The clock is advanced only while visible and unpaused; no timers run behind it.
export class FooterAIWorld {
  width: number;
  displayScale = 1;
  x = 0;
  time = 0;
  phase: Phase = "rest";
  angle = 0;
  antenna = 0;
  gaze = 0;
  turn = 0;
  blink = 1;
  greeting: Message = "step";
  completed = 0;
  greetings = 0;
  planted = 0;
  garden: Flower[] = [];
  targetSlot: number | null = null;
  targetX: number | null = null;
  seed = { visible: false, x: 0, y: 0 };
  private random: () => number;
  private start = 0;
  private end = 0;
  private walk?: Walk;
  private accumulator = 0;
  private antennaVelocity = 0;
  private nextBlink = 0;
  private blinkEnd = 0;
  private nextSpeech = 0;
  private restSpeechAt = Infinity;
  private nextPlant = 0;
  private planting = false;
  private walksSincePlant = 0;
  private lookDirection = 1;
  private growTalk = false;
  private growthWait = 0;
  private speechMuted = false;

  constructor(random: () => number = Math.random, width = 360, snapshot?: Snapshot) {
    this.random = random;
    this.width = Math.max(180, width);
    if (snapshot) { this.applySnapshot(snapshot); return; }
    this.x = this.range(MARGIN + 8, this.width - MARGIN - 8);
    this.end = this.range(600, 1800);
    this.nextBlink = this.range(1800, 4300);
    this.nextSpeech = this.range(1500, 5000);
    this.nextPlant = this.range(14000, 23000);
  }
  snapshot(): Snapshot {
    const normalize = (x: number) => clamp((x - MARGIN) / (this.width - MARGIN * 2), 0, 1);
    return {
      version: 2, x: normalize(this.x), time: this.time, phase: this.phase, angle: this.angle, antenna: this.antenna, gaze: this.gaze, turn: this.turn, blink: this.blink,
      greeting: this.greeting, speechMuted: this.speechMuted, completed: this.completed, greetings: this.greetings, planted: this.planted,
      garden: this.garden.map(f => ({ ...f })), targetSlot: this.targetSlot, targetX: this.targetX, seed: { visible: this.seed.visible, y: this.seed.y },
      start: this.start, end: this.end, walk: this.walk ? { ...this.walk, from: normalize(this.walk.from), to: normalize(this.walk.to) } : null,
      accumulator: this.accumulator, antennaVelocity: this.antennaVelocity,
      nextBlink: this.nextBlink, blinkEnd: this.blinkEnd, nextSpeech: this.nextSpeech,
      restSpeechAt: Number.isFinite(this.restSpeechAt) ? this.restSpeechAt : null,
      nextPlant: this.nextPlant, planting: this.planting, walksSincePlant: this.walksSincePlant, lookDirection: this.lookDirection, growTalk: this.growTalk, growthWait: this.growthWait,
    };
  }
  static fromSnapshot(value: unknown, width: number, random: () => number = Math.random) {
    if (!validSnapshot(value)) return;
    // Upgrade existing gardens without moving, regrowing, or rerandomizing them.
    // A removed utterance finishes silently in its original action/time window.
    const removed = !['step', 'spaces', 'radiant'].includes(value.greeting);
    const migrated: Snapshot = {
      ...value, greeting: removed ? 'step' : value.greeting,
      speechMuted: removed || (value.speechMuted ?? false),
      targetX: value.targetX ?? (value.targetSlot === null ? null : value.targetSlot / LEGACY_SLOT_SPAN),
      garden: value.garden.map((flower, index) => ({ ...flower, x: flower.x ?? flower.slot / LEGACY_SLOT_SPAN, variant: flower.variant ?? index % 3 as Variant })),
    };
    return new FooterAIWorld(random, width, migrated);
  }
  private applySnapshot(s: Snapshot) {
    const position = (x: number) => MARGIN + x * (this.width - MARGIN * 2);
    this.x = position(s.x); this.time = s.time; this.phase = s.phase;
    this.angle = s.angle; this.antenna = s.antenna; this.gaze = s.gaze; this.turn = s.turn; this.blink = s.blink;
    this.greeting = s.greeting; this.speechMuted = s.speechMuted ?? false; this.completed = s.completed; this.greetings = s.greetings; this.planted = s.planted;
    this.garden = s.garden.map(f => ({ ...f })); this.targetSlot = s.targetSlot; this.targetX = s.targetX ?? null; this.seed = { ...s.seed, x: 0 };
    this.start = s.start; this.end = s.end;
    this.walk = s.walk ? { ...s.walk, from: position(s.walk.from), to: position(s.walk.to) } : undefined;
    this.accumulator = s.accumulator; this.antennaVelocity = s.antennaVelocity;
    this.nextBlink = s.nextBlink; this.blinkEnd = s.blinkEnd; this.nextSpeech = s.nextSpeech;
    this.restSpeechAt = s.restSpeechAt ?? Infinity;
    this.nextPlant = s.nextPlant; this.planting = s.planting; this.walksSincePlant = s.walksSincePlant;
    this.lookDirection = s.lookDirection; this.growTalk = s.growTalk; this.growthWait = s.growthWait ?? 0;
    if (this.phase === 'plant') this.updateSeed();
  }
  private range(min: number, max: number) { return min + (max - min) * this.random(); }
  resize(width: number) {
    const next = Math.max(180, width), ratio = (next - MARGIN * 2) / (this.width - MARGIN * 2);
    this.x = MARGIN + (this.x - MARGIN) * ratio;
    if (this.walk) {
      this.walk.from = MARGIN + (this.walk.from - MARGIN) * ratio;
      this.walk.to = MARGIN + (this.walk.to - MARGIN) * ratio;
    }
    this.width = next;
    // A narrower viewport may invalidate a destination that has not been planted.
    // Finish the walk normally, but do not start an invisible planting loop.
    if (this.targetSlot !== null && !this.garden.some(f => f.slot === this.targetSlot)
      && this.garden.some(f => Math.abs(this.flowerPosition(f.slot) - this.flowerX) < this.plantingGap)) {
      if (this.walk) this.walk.planting = false;
      this.planting = false;
      if (this.phase === 'plant-look') { this.growTalk = false; this.enter('settle', 650); }
    }
    if (this.phase === 'plant') this.updateSeed();
  }
  private updateSeed() {
    const progress = clamp((this.time - this.start) / (this.end - this.start), 0, 1);
    const direction = Math.sign(this.flowerX - this.x), drop = clamp((progress - .27) / .48, 0, 1);
    this.seed.visible = progress >= .27 && progress <= .78;
    this.seed.x = this.x + direction * 20 + (this.flowerX - this.x - direction * 20) * ease(drop);
    this.seed.y = -18 + 17 * drop * drop - 4 * Math.sin(drop * Math.PI);
  }
  private enter(phase: Phase, duration: number) {
    this.phase = phase; this.start = this.time; this.end = this.time + duration;
  }
  flowerPosition(slot: number) {
    const x = this.garden.find(f => f.slot === slot)?.x ?? (slot === this.targetSlot ? this.targetX : null) ?? slot / LEGACY_SLOT_SPAN;
    return this.gardenMargin + x * (this.width - this.gardenMargin * 2);
  }
  get flowerX() { return this.flowerPosition(this.targetSlot ?? 0); }
  get gardenMargin() { return 20 / this.displayScale; }
  get plantingGap() { return 32 / this.displayScale; }
  get capacity() { return Math.min(MAX_FLOWERS, Math.floor((this.width - this.gardenMargin * 2) / this.plantingGap) + 1); }
  get plantingIntervals() {
    if (this.garden.length >= MAX_FLOWERS) return [];
    const positions = this.garden.map(f => this.flowerPosition(f.slot)).sort((a, b) => a - b);
    const intervals: { left: number; right: number }[] = [];
    let left = this.gardenMargin;
    for (const x of positions) {
      if (x - this.plantingGap - left >= 4) intervals.push({ left, right: x - this.plantingGap });
      left = Math.max(left, x + this.plantingGap);
    }
    if (this.width - this.gardenMargin - left >= 4) intervals.push({ left, right: this.width - this.gardenMargin });
    return intervals;
  }
  get visibleGarden() {
    // Older flowers have stable priority. The clearance test includes all earlier
    // flowers, so each one's visibility threshold stays fixed as the viewport grows.
    return this.garden.filter((flower, index) => this.garden.slice(0, index).every(earlier =>
      Math.abs(this.flowerPosition(earlier.slot) - this.flowerPosition(flower.slot)) >= this.plantingGap - .001));
  }
  private get growingFlower() { return this.garden.find(f => f.slot === this.targetSlot); }
  private get blooms() { return this.garden.filter(f => f.growth === 1).length; }
  private readingTime() { return speechTime[this.greeting] + this.range(200, 700); }
  get bubbleVisible() {
    if (this.speechMuted) return false;
    const progress = (this.time - this.start) / (this.end - this.start);
    return this.phase === 'greet'
      || (this.phase === 'plant-look' && this.growTalk && this.time - this.start > 250)
      || (this.phase === 'plant' && this.growTalk && progress > .04 && progress < .98)
      || (this.phase === 'grow' && this.growTalk && this.time - this.start > 250 && this.time - this.start < this.growthWait - 250)
      || (this.phase === 'admire' && this.growTalk && this.time - this.start > 650);
  }
  private startWalk() {
    const span = this.width - MARGIN * 2;
    let direction = this.random() < .5 ? -1 : 1;
    let room = direction > 0 ? this.width - MARGIN - this.x : this.x - MARGIN;
    if (room < 48) { direction *= -1; room = direction > 0 ? this.width - MARGIN - this.x : this.x - MARGIN; }
    const choice = this.random();
    const wanted = this.completed === 0 ? this.range(65, 110)
      : choice < .6 ? this.range(45, 145)
      : choice < .9 ? this.range(150, Math.max(170, span * .43))
      : this.range(span * .45, span * .85);
    const empty = this.plantingIntervals;
    const planting = this.time >= this.nextPlant && empty.length > 0 && this.completed > 0 && this.walksSincePlant >= 2;
    if (planting) {
      // Sample continuous free space by length. IDs track flowers, not a grid.
      this.targetSlot = Array.from({ length: MAX_FLOWERS }, (_, i) => i).find(id => !this.garden.some(f => f.slot === id))!;
      let offset = this.random() * empty.reduce((sum, gap) => sum + gap.right - gap.left, 0);
      let target = empty[empty.length - 1].right;
      for (const gap of empty) {
        const length = gap.right - gap.left;
        if (offset <= length) { target = gap.left + offset; break; }
        offset -= length;
      }
      this.targetX = (target - this.gardenMargin) / (this.width - this.gardenMargin * 2);
    }
    const standSide = this.flowerX < this.width / 2 ? 1 : -1;
    const target = planting ? clamp(this.flowerX + standSide * 48, MARGIN, this.width - MARGIN) : this.x + direction * Math.min(room, wanted);
    const distance = Math.abs(target - this.x);
    // Each short weight transfer is a step. Progress slows at each planted edge,
    // instead of translating a continuously rocking sprite at constant speed.
    const steps = Math.max(2, Math.round(distance / this.range(10, 16)));
    const duration = steps * this.range(330, 440);
    this.walk = { from: this.x, to: target, steps, duration, lean: this.range(5.2, 6.5), planting };
    this.enter('walk', duration);
  }
  private rest() {
    this.angle = 0; this.gaze = 0;
    this.enter('rest', this.random() < .18 ? this.range(9500, 12500) : this.range(4000, 7800));
    this.restSpeechAt = this.time >= this.nextSpeech && this.random() < .5 ? this.time + this.range(1000, 2300) : Infinity;
  }
  private look() {
    this.lookDirection = this.random() < .5 ? -1 : 1;
    this.enter('look', this.range(650, 1100));
  }
  private say(choices: Message[]) {
    const candidates = choices.filter(m => this.greetings === 0 || m !== this.greeting);
    if (!candidates.length) return false;
    this.greeting = candidates[Math.floor(this.random() * candidates.length)];
    this.speechMuted = false;
    this.greetings++;
    return true;
  }
  private speak() {
    const choices: Message[] = ['step'];
    const nearby = this.garden.some(f => f.growth === 1 && Math.abs(this.flowerPosition(f.slot) - this.x) < 95);
    if (nearby) choices.push('radiant');
    if (!this.say(choices)) { this.rest(); return; }
    this.enter('greet', this.readingTime());
  }
  private nextVariant(): Variant {
    const counts = [0, 0, 0];
    for (const flower of this.garden) counts[flower.variant]++;
    const previous = this.garden.at(-1)?.variant;
    const candidates = ([0, 1, 2] as Variant[]).filter(v => v !== previous);
    const least = Math.min(...candidates.map(v => counts[v]));
    const choices = candidates.filter(v => counts[v] === least);
    return choices[Math.floor(this.random() * choices.length)];
  }
  private transition() {
    if (this.phase === 'rest') this.startWalk();
    else if (this.phase === 'walk') {
      this.x = this.walk!.to; this.planting = this.walk!.planting;
      this.angle = 0; this.walk = undefined; this.completed++; this.walksSincePlant++;
      this.enter('settle', this.range(650, 1000));
    } else if (this.phase === 'settle') {
      if (this.planting) { this.growTalk = this.say(['step']); this.enter('plant-look', this.growTalk ? this.readingTime() + 250 : 1800); }
      else if (this.time >= this.nextSpeech && this.random() < .72) this.look();
      else this.rest();
    } else if (this.phase === 'look') this.speak();
    else if (this.phase === 'greet') { this.nextSpeech = this.time + this.range(12000, 20000); this.rest(); }
    else if (this.phase === 'plant-look') { this.growTalk = false; this.enter('plant', this.range(4200, 5000)); }
    else if (this.phase === 'plant') {
      this.seed.visible = false;
      if (!this.growingFlower && this.garden.length < MAX_FLOWERS) this.garden.push({ slot: this.targetSlot!, x: this.targetX!, growth: 0, variant: this.nextVariant() });
      this.growTalk = false; this.growthWait = this.range(650, 1100);
      this.enter('grow', this.growthWait + this.range(6000, 7000));
    } else if (this.phase === 'grow') {
      this.growingFlower!.growth = 1;
      this.planted++; this.walksSincePlant = 0; this.planting = false;
      const choices: Message[] = ['radiant'];
      if (this.blooms >= 2) choices.push('spaces');
      this.growTalk = this.say(choices);
      this.enter('admire', this.readingTime() + 650);
    } else {
      this.nextSpeech = this.time + this.range(12000, 20000);
      this.nextPlant = this.time + this.range(18000, 32000); this.rest();
    }
  }

  update(delta: number) {
    this.accumulator += clamp(delta, 0, 100) / 1000;
    const dt = 1 / 120;
    while (this.accumulator >= dt) {
      this.accumulator -= dt; this.time += dt * 1000;
      if (this.time >= this.end) this.transition();
      if (this.phase === 'rest' && this.time >= this.restSpeechAt) { this.restSpeechAt = Infinity; this.look(); }
      const progress = clamp((this.time - this.start) / (this.end - this.start), 0, 1);
      let turnTarget = 0;
      if (this.phase === 'walk') {
        const w = this.walk!, step = progress * w.steps, index = Math.floor(step), part = step - index;
        this.x = w.from + (w.to - w.from) * (index + ease(part)) / w.steps;
        const envelope = Math.min(1, step * 2, (w.steps - step) * 2);
        this.angle = Math.sin(step * Math.PI) * w.lean * envelope;
        this.gaze += (Math.sign(w.to - w.from) * .65 - this.gaze) * .09;
        turnTarget = Math.sign(w.to - w.from) * Math.min(1, step * 1.4, (w.steps - step) * 1.4);
      } else if (this.phase === 'look') {
        this.angle = this.lookDirection * 2.5 * ease(progress);
        this.gaze *= .92;
      } else if (this.phase === 'greet') {
        this.angle = this.lookDirection * 2.5 * (1 - ease(Math.min(1, progress * 2.4)));
        this.gaze *= .92;
      } else if (this.phase === 'plant') {
        const direction = Math.sign(this.flowerX - this.x);
        this.angle = direction * 11 * Math.sin(progress * Math.PI);
        turnTarget = direction * .7; this.gaze = direction * .8;
        this.updateSeed();
      } else if (this.phase === 'grow') {
        const elapsed = this.time - this.start;
        const growing = clamp((elapsed - this.growthWait) / (this.end - this.start - this.growthWait), 0, 1);
        this.angle = Math.sign(this.flowerX - this.x) * 2 * Math.sin(growing * Math.PI);
        turnTarget = elapsed < this.growthWait ? 0 : Math.sign(this.flowerX - this.x) * .4;
        if (this.growingFlower) this.growingFlower.growth = ease(growing); this.gaze = Math.sign(this.flowerX - this.x) * .8;
      } else { this.angle = 0; this.gaze *= .92; }
      this.turn += (turnTarget - this.turn) * (1 - Math.exp(-dt * 8));
      if (Math.abs(this.turn) < .0001) this.turn = 0;
      const spring = (-this.angle * .7 - this.antenna) * 48 - this.antennaVelocity * 10;
      this.antennaVelocity += spring * dt;
      this.antenna += this.antennaVelocity * dt;
      if (this.time >= this.nextBlink) {
        this.blinkEnd = this.time + 145;
        this.nextBlink = this.time + this.range(3500, 8200);
      }
      this.blink = this.time < this.blinkEnd ? .15 : 1;
    }
  }
}
