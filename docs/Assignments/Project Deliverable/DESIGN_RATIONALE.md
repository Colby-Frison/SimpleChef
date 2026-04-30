# Design Motivation / Problems in the Original UI

**Requirements:** *discussion of major usability issues in the original interface with annotated screenshots, or motivation and UX goals if the project involves a new interface*

## Context

SimpleChef is a new interface rather than a direct redesign of one existing product. Therefore, this section focuses on major usability problems repeatedly observed in current cooking/planning workflows and explains the UX goals that guided our design.

## Main usability issues

1. Workflow fragmentation across multiple apps.
   - Users often browse recipes in one app/site, plan meals in another tool, track calories elsewhere, and keep grocery lists separately.
   - This causes repeated context switching and duplicated entry.

2. Recipe instructions are difficult to execute under real cooking conditions.
   - Instructions are frequently long and dense instead of step-focused.
   - Users must mentally extract sequence and timing while multitasking.

3. Timer management is disconnected from recipe flow.
   - Timers are commonly external (phone clock/smart speaker/another app).
   - Switching away from the recipe increases error risk and user stress.

4. Meal planning and grocery generation are weakly connected.
   - Planned meals do not reliably convert into editable grocery lists.
   - Users still perform manual ingredient aggregation and deduplication.

5. Recipe input/editing has high correction cost.
   - Imported or parsed recipe content can be inconsistent.
   - Many interfaces do not provide clear, fast verification/edit workflows.

6. Health and preference settings are not integrated into routine flow.
   - Calorie goals and dietary constraints are often standalone settings rather than active constraints during browse/plan/cook.

## Motivation and UX goals

Based on these issues, we defined the following UX goals:

- Unify core tasks in one system: browse -> cook -> plan -> grocery without tool-hopping.
- Prioritize execution clarity in cooking mode: one current step, visible progress, and integrated timer actions.
- Support progressive disclosure: show only immediately relevant information while keeping full details available on demand.
- Automate repetitive work with user control: merge from plan and smart defaults, but keep all entries editable.
- Reduce correction friction in recipe creation: parse/import plus a manual verification path before save.
- Integrate personal goals into daily flows: profile preferences should influence planning and decision-making.

## Evidence to include with this section

For submission, pair this write-up with annotated screenshots from your prototype showing:

- Home/library -> Recipe detail -> Cooking mode (step + timer interactions)
- Calendar day planning and calorie summary
- Grocery merge/edit/export flow
- Add/edit recipe verification path
- Profile preferences tied to planning/cooking behavior
