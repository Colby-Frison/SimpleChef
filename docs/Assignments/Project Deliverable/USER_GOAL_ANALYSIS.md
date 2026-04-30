# User Goal Analysis

**Requirements:** description of the target users, tasks, motivations, needs, and pain points, with a brief mention of any methods used to identify them.

## Methods used to identify users and goals

Our team used lightweight but practical methods during design and implementation:

- Comparative UI analysis of common cooking/planning tools to identify repeated usability gaps (fragmented flows, long instruction walls, context switching for timers/lists).
- Scenario-based walkthroughs of our own target flow (browse -> cook -> plan -> grocery) to validate where friction appears.
- Iterative prototype testing within the team while implementing the web prototype and backend, focusing on task completion speed and clarity.
- Requirement tracing between proposal goals and implementation status (`docs/REQUIREMENTS_TRACEABILITY.md`, `docs/FIGMA_UI_SYSTEM_REQUIREMENTS.md`) to keep user needs tied to shipped features.

## Target Users

### Primary users

1. Busy students and working adults cooking at home.
2. Health-conscious users tracking daily intake.
3. Beginner/intermediate home cooks who need guided execution.

### Secondary users

4. Household meal planners preparing several meals at once.
5. Users with dietary preferences/restrictions needing better filtering and defaults.

## Tasks

- Discover and open recipes from a personal library.
- Review recipe details (ingredients, times, difficulty, servings, calories).
- Execute recipes step-by-step with integrated timers.
- Plan meals on specific dates and meal types in calendar flows.
- Track day-level calories from planned/custom meals.
- Generate and manage grocery items from planned meals.
- Add/edit recipes manually or from parsed text and verify parsed output.
- Update profile preferences (calorie goal, dietary restrictions, screen behavior).

## Motivations

- Reduce cognitive load while cooking by seeing only what is relevant now.
- Save time by reducing app switching and repeated manual data entry.
- Improve consistency in meal planning and grocery preparation.
- Stay aligned with health goals through integrated calorie context.
- Maintain control over automated features (editable meals/items/recipe content).

## Needs

- A single, coherent workflow across recipe, cooking, planning, and grocery tasks.
- Clear visual hierarchy and progressive disclosure in high-focus contexts.
- Reliable timer interactions without leaving the current cooking screen.
- Fast add/edit flows with sensible defaults and low-friction corrections.
- Data ownership boundaries (private plans/lists/profile data).
- Transparent automation (merge/suggest) with easy manual override.

## Pain Points

- Fragmented ecosystem: recipes, calorie tracking, and shopping are often spread across multiple tools.
- Instruction overload: long text blocks make it hard to identify the immediate next action.
- Timer context switching: users lose place when leaving recipe steps to manage timers.
- Planning-to-shopping disconnect: meal plans do not automatically become practical grocery lists.
- Recipe input friction: imported recipe content may be messy and needs quick correction workflows.
- Insufficient personalization: dietary restrictions and calorie goals are often not integrated into daily flow.
