# Design Rationale

**Requirements:** *explanation of major design decisions and how they improve usability, supported by relevant HCI principles*

## Major design decisions

### 1) Controller-based frontend architecture (thin pages, logic in controllers)

- Decision: Keep route/page components focused on rendering while moving orchestration (load/save, derived state, flow actions) into controller hooks.
- Usability impact: Enables faster, safer iteration on behavior and reduces regressions in user-facing flows.
- Relevant HCI principle: Consistency and reliability.

### 2) Step-first cooking mode with integrated timers

- Decision: Center the cooking experience around one active step with timer actions in context and a dock for active timers.
- Usability impact: Reduces cognitive overhead and context switching during high-attention tasks.
- Relevant HCI principles: Recognition over recall, visibility of system status, cognitive load reduction.

### 3) Progressive disclosure across recipe and planning flows

- Decision: Use expandable/collapsible sections and modal/detail patterns to avoid overloading screens.
- Usability impact: Users complete core tasks without scanning irrelevant controls while preserving access to detail when needed.
- Relevant HCI principles: Progressive disclosure, minimalist design, user control and freedom.

### 4) Ownership-aware backend authorization patterns

- Decision: Apply owner-scoped read/write logic and non-leaking not-found patterns where relevant.
- Usability impact: Predictable access boundaries improve trust and prevent cross-user data exposure.
- Relevant HCI principles: Error prevention, trust/safety.

### 5) Merge-from-plan grocery workflow with manual override

- Decision: Provide automatic ingredient aggregation from planner data while preserving edit/check/delete control.
- Usability impact: Automation reduces repetitive effort while editable results preserve user agency.
- Relevant HCI principles: Smart defaults with full control, flexibility and efficiency of use.

### 6) Multi-path recipe creation (manual + parse-assisted)

- Decision: Support manual entry and parse-assisted entry with verification/edit before persistence.
- Usability impact: Accommodates different user preferences and confidence levels while limiting bad data.
- Relevant HCI principles: Flexibility, recoverability, user control.

### 7) Day-focused calendar planning and nutrition context

- Decision: Emphasize actionable day-level meal and calorie context with quick-add and library-based additions.
- Usability impact: Keeps planning lightweight for short sessions while still supporting structured meal logging.
- Relevant HCI principles: Match between system and real-world tasks, efficiency of use.

## Relevant HCI principles (summary)

- Clarity over clutter.
- Progressive disclosure.
- Recognition over recall.
- Error prevention and recovery.
- User control and freedom.
- Consistency across similar flows.

## Mapping rationale to project goals

- Calm, guided cooking -> step-wise flow + timer dock + focused content.
- Unified workflow -> integrated routes/controllers/API across recipe/planner/grocery/profile.
- Reduced manual overhead -> planner-to-grocery merge and parse-assisted recipe input.
- Trust + control -> ownership-aware authorization and editable generated content.
