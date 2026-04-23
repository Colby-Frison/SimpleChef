import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { MealPlanDto } from '@/lib/dto';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';

const PROTEIN_KCAL_PER_G = 4;
const CARB_KCAL_PER_G = 4;
const FAT_KCAL_PER_G = 9;

/** Prior thick ring (98 − 54.8); current band is 30% of that thickness, same centerline. */
const DATA_RING_THICK_BASE = 98 - (52 + 14 * 0.2);
const DATA_RING_THICK = DATA_RING_THICK_BASE * 0.3;
const DATA_MID = (98 + (52 + 14 * 0.2)) / 2;
const DATA_INNER_PCT = DATA_MID - DATA_RING_THICK / 2;
const DATA_OUTER_PCT = DATA_MID + DATA_RING_THICK / 2;
const TRACK_RIM_PAD = 2.8;
const TRACK_INNER_PCT = Math.max(48, DATA_INNER_PCT - TRACK_RIM_PAD);
const TRACK_OUTER_PCT = Math.min(100, DATA_OUTER_PCT + TRACK_RIM_PAD);

const COLORS = {
  protein: '#e11d48',
  carbs: '#ea580c',
  fat: '#4f46e5',
  untracked: 'var(--macro-ring-untracked)',
  remainder: 'var(--macro-ring-remainder)',
} as const;

const MACRO_NAMES = new Set(['Protein', 'Carbs', 'Fat']);
const OTHER_NAMES = new Set(['Untracked', 'Remaining']);

const LS_MACRO_RING = 'simplechef.calendar.macroRingExpanded';
const PIE_CORNER_RADIUS = 6;

type Slice = { name: string; value: number; fill: string };

function consumedFromPlans(plans: MealPlanDto[]): number {
  return plans.reduce((s, p) => (p.calories != null ? s + Number(p.calories) : s), 0);
}

function buildSlices(plans: MealPlanDto[], logged: number): Slice[] {
  let pk = 0;
  let ck = 0;
  let fk = 0;
  for (const p of plans) {
    pk += (p.protein_grams ?? 0) * PROTEIN_KCAL_PER_G;
    ck += (p.carbs_grams ?? 0) * CARB_KCAL_PER_G;
    fk += (p.fat_grams ?? 0) * FAT_KCAL_PER_G;
  }
  const macroSum = pk + ck + fk;
  const baseLogged = logged > 0 ? logged : macroSum;

  let chartP = pk;
  let chartC = ck;
  let chartF = fk;
  let chartU = Math.max(0, baseLogged - pk - ck - fk);

  if (baseLogged > 0 && macroSum > baseLogged) {
    const r = baseLogged / macroSum;
    chartP = pk * r;
    chartC = ck * r;
    chartF = fk * r;
    chartU = 0;
  }

  const raw: Slice[] = [
    { name: 'Protein', value: chartP, fill: COLORS.protein },
    { name: 'Carbs', value: chartC, fill: COLORS.carbs },
    { name: 'Fat', value: chartF, fill: COLORS.fat },
    { name: 'Untracked', value: chartU, fill: COLORS.untracked },
  ];
  return raw.filter((x) => x.value > 0.05);
}

function sumSliceValues(slices: Slice[]): number {
  return slices.reduce((a, x) => a + x.value, 0);
}

function scaleSlices(slices: Slice[], targetSum: number): Slice[] {
  const s = sumSliceValues(slices);
  if (s <= 0 || targetSum <= 0) return [];
  const k = targetSum / s;
  return slices
    .map((x) => ({ ...x, value: x.value * k }))
    .filter((x) => x.value > 0.05);
}

/** When a daily calorie goal is set, the full ring circumference represents this many kcal (daily target). */
function buildPieSlices(plans: MealPlanDto[], logged: number, goal: number | null | undefined): Slice[] {
  const base = buildSlices(plans, logged);
  const chartSum = sumSliceValues(base);
  const foodTotal = Math.max(logged, chartSum);

  if (goal != null && goal > 0 && Number.isFinite(goal)) {
    if (foodTotal <= 0) {
      return [{ name: 'Remaining', value: goal, fill: COLORS.remainder }];
    }
    if (foodTotal <= goal) {
      const nutrition = scaleSlices(base, foodTotal);
      const rem = goal - foodTotal;
      if (rem > 0.05) {
        return [...nutrition, { name: 'Remaining', value: rem, fill: COLORS.remainder }];
      }
      return nutrition.length > 0 ? nutrition : [{ name: 'Remaining', value: goal, fill: COLORS.remainder }];
    }
    return scaleSlices(base, goal);
  }

  return base;
}

type RingLayout =
  | { mode: 'single'; slices: Slice[] }
  | { mode: 'split'; macroSlices: Slice[]; otherSlices: Slice[]; macroEndAngle: number };

function layoutRingSlices(slices: Slice[]): RingLayout | null {
  const T = sumSliceValues(slices);
  if (T <= 0 || !Number.isFinite(T)) return null;

  const macroSlices = slices.filter((d) => MACRO_NAMES.has(d.name));
  const otherSlices = slices.filter((d) => OTHER_NAMES.has(d.name));
  const M = sumSliceValues(macroSlices);
  const O = sumSliceValues(otherSlices);

  const macroTiny = M <= 0.05;
  const otherTiny = O <= 0.05;

  if (macroTiny && otherTiny) return null;
  if (macroTiny || otherTiny) {
    return { mode: 'single', slices };
  }

  const macroEndAngle = 90 - (360 * M) / T;
  if (!Number.isFinite(macroEndAngle)) return { mode: 'single', slices };

  return { mode: 'split', macroSlices, otherSlices, macroEndAngle };
}

const pct = (n: number) => `${n.toFixed(2)}%`;
const DATA_RADIUS_INNER = pct(DATA_INNER_PCT);
const DATA_RADIUS_OUTER = pct(DATA_OUTER_PCT);
const TRACK_RADIUS_INNER = pct(TRACK_INNER_PCT);
const TRACK_RADIUS_OUTER = pct(TRACK_OUTER_PCT);

type Props = {
  plans: MealPlanDto[];
  consumedCalories: number | null | undefined;
  /** When set, the full ring circumference represents this many kcal (daily target). */
  dailyCalorieGoal?: number | null;
};

function readMacroRingExpanded(): boolean {
  try {
    const v = localStorage.getItem(LS_MACRO_RING);
    if (v === '0') return false;
    if (v === '1') return true;
  } catch {
    /* ignore */
  }
  return true;
}

export function DayMacroRing({ plans, consumedCalories, dailyCalorieGoal }: Props) {
  const [ringOpen, setRingOpen] = useState(() =>
    typeof window !== 'undefined' ? readMacroRingExpanded() : true
  );

  useEffect(() => {
    try {
      localStorage.setItem(LS_MACRO_RING, ringOpen ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [ringOpen]);

  const logged =
    consumedCalories != null && consumedCalories >= 0 ? consumedCalories : consumedFromPlans(plans);

  const goal = dailyCalorieGoal != null && dailyCalorieGoal > 0 ? dailyCalorieGoal : null;

  const data = useMemo(() => buildPieSlices(plans, logged, goal), [plans, logged, goal]);

  const ringLayout = useMemo(() => layoutRingSlices(data), [data]);

  const macroKcalDisplay = useMemo(() => {
    let pk = 0;
    let ck = 0;
    let fk = 0;
    for (const p of plans) {
      pk += (p.protein_grams ?? 0) * PROTEIN_KCAL_PER_G;
      ck += (p.carbs_grams ?? 0) * CARB_KCAL_PER_G;
      fk += (p.fat_grams ?? 0) * FAT_KCAL_PER_G;
    }
    return { protein: pk, carbs: ck, fat: fk };
  }, [plans]);

  const overGoal = goal != null && logged > goal;

  const summaryLine =
    goal != null
      ? `${logged} / ${goal} kcal${overGoal ? ` (+${logged - goal} over)` : ''}`
      : `${logged} kcal logged`;

  if (data.length === 0 || ringLayout == null) {
    return (
      <div className="rounded-2xl border border-border bg-card/50 px-4 py-6">
        <p className="text-sm text-muted-foreground text-center">
          No calories logged for this day. Add meals to see the nutrition ring.
        </p>
      </div>
    );
  }

  const paddingAngle = 0.35;
  const otherAnimMs = 480;

  const pieCommon = {
    cx: '50%' as const,
    cy: '50%' as const,
    innerRadius: DATA_RADIUS_INNER,
    outerRadius: DATA_RADIUS_OUTER,
    paddingAngle,
    stroke: 'hsl(var(--border))' as const,
    strokeWidth: 1,
    cornerRadius: PIE_CORNER_RADIUS,
  };

  return (
    <Collapsible open={ringOpen} onOpenChange={setRingOpen} className="rounded-2xl border border-border bg-card/50">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/80">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-tight">Nutrition ring</p>
          <p className="text-xs text-muted-foreground truncate tabular-nums">{summaryLine}</p>
        </div>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="shrink-0 gap-1 text-muted-foreground">
            <span className="sr-only">{ringOpen ? 'Hide' : 'Show'} nutrition ring</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${ringOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-3">
          <div className="relative mx-auto aspect-square w-full max-w-[260px] min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={180}>
              <PieChart>
                <Pie
                  data={[{ name: 'track', value: 1 }]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={TRACK_RADIUS_INNER}
                  outerRadius={TRACK_RADIUS_OUTER}
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={false}
                  stroke="none"
                >
                  <Cell fill="var(--macro-ring-track)" />
                </Pie>
                {ringLayout.mode === 'single' ? (
                  <Pie
                    data={ringLayout.slices}
                    dataKey="value"
                    nameKey="name"
                    {...pieCommon}
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive={false}
                    animationDuration={0}
                  >
                    {ringLayout.slices.map((entry, i) => (
                      <Cell key={`${entry.name}-${i}`} fill={entry.fill} />
                    ))}
                  </Pie>
                ) : (
                  <>
                    <Pie
                      data={ringLayout.macroSlices}
                      dataKey="value"
                      nameKey="name"
                      {...pieCommon}
                      startAngle={90}
                      endAngle={ringLayout.macroEndAngle}
                      isAnimationActive={false}
                      animationDuration={0}
                    >
                      {ringLayout.macroSlices.map((entry, i) => (
                        <Cell key={`macro-${entry.name}-${i}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Pie
                      key={ringLayout.otherSlices.map((s) => `${s.name}-${s.value}`).join('|')}
                      data={ringLayout.otherSlices}
                      dataKey="value"
                      nameKey="name"
                      {...pieCommon}
                      startAngle={ringLayout.macroEndAngle}
                      endAngle={-270}
                      isAnimationActive
                      animationDuration={otherAnimMs}
                      animationEasing="ease-out"
                      animationBegin={0}
                    >
                      {ringLayout.otherSlices.map((entry, i) => (
                        <Cell key={`other-${entry.name}-${i}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </>
                )}
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Logged</p>
              <p className="text-2xl font-semibold tabular-nums leading-tight">{logged}</p>
              <p className="text-[10px] text-muted-foreground">kcal</p>
              {goal != null ? (
                <p className="mt-0.5 text-[10px] text-muted-foreground tabular-nums">
                  Goal {goal}
                  {overGoal ? ` · +${logged - goal}` : ''}
                </p>
              ) : null}
            </div>
          </div>
          <ul className="mx-auto mt-3 flex max-w-xs flex-col gap-1.5 text-sm">
            <li className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: COLORS.protein }} />
                Protein
              </span>
              <span className="tabular-nums text-muted-foreground">{Math.round(macroKcalDisplay.protein)}</span>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: COLORS.carbs }} />
                Carbs
              </span>
              <span className="tabular-nums text-muted-foreground">{Math.round(macroKcalDisplay.carbs)}</span>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: COLORS.fat }} />
                Fat
              </span>
              <span className="tabular-nums text-muted-foreground">{Math.round(macroKcalDisplay.fat)}</span>
            </li>
            <li className="flex items-center justify-between gap-2 text-xs text-muted-foreground border-t border-border pt-2 mt-1">
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full border border-border/60"
                  style={{ background: 'var(--macro-ring-untracked)' }}
                />
                Other
              </span>
              <span className="text-right">Kcal beyond logged macros</span>
            </li>
            {goal != null ? (
              <li className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--macro-ring-remainder)' }} />
                  Left
                </span>
                <span className="text-right">Room to daily goal</span>
              </li>
            ) : null}
            <li className="text-[10px] text-muted-foreground pt-1">Macro kcal: 4/g protein and carbs, 9/g fat.</li>
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
