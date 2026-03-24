Below are the Mermaid diagrams for the User Flow and Gantt Chart. You can render these using the [Mermaid Live Editor](https://mermaid.live/) or integrate them into your LaTeX document using the `mermaid` package (if supported) or by exporting as images.

---

### Figure 8: User Flow Diagram (Mermaid)

```mermaid
flowchart TD
    A[App Launch] --> B{New User?}
    B -->|Yes| C[Onboarding]
    B -->|No| D[Home Screen]
    C --> D

    D --> E[Browse Recipes]
    D --> F[View Calendar]
    D --> G[Access Profile]

    E --> H[Recipe Detail]
    H --> I[Begin Cooking]
    I --> J[Step-by-Step Cooking Mode]

    F --> K[Select Day]
    K --> L[Add to Meal Plan]
    L --> M[Update Grocery List]

    D --> N[View Grocery List]
    M --> N
    N --> O[Edit/Categorize Items]
    O --> P[Export List]
    P --> Q[Notes / Shopping App]

    G --> R[Edit Preferences]
    G --> S[View Friends]
```

---

### Figure 10: Gantt Chart (Mermaid)

```mermaid
gantt
    title SimpelChef Development Timeline
    dateFormat  YYYY-MM-DD
    axisFormat %b %d

    section Phase 1: Foundation
    Repository Setup           :done, 2026-01-15, 7d
    Environment Config         :done, 2026-01-20, 5d
    Firebase Integration       :done, 2026-01-22, 10d
    Navigation Structure       :done, 2026-02-01, 5d
    Authentication Flow        :done, 2026-02-05, 7d

    section Phase 2: Data Models
    Database Schema Design     :done, 2026-02-10, 7d
    API Integration Testing    :done, 2026-02-15, 7d
    Recipe Parsing Algorithms  :done, 2026-02-18, 10d

    section Phase 3: Core Features
    Recipe Library             :done, 2026-02-20, 8d
    Recipe Detail              :done, 2026-02-25, 5d
    Calendar Integration       :done, 2026-02-28, 7d
    Grocery List Basic         :done, 2026-03-03, 5d
    Profile Management         :done, 2026-03-06, 4d

    section Phase 4: Advanced Features
    Cooking Mode Development   :active, 2026-03-01, 25d
    AI Recipe Parsing          :active, 2026-03-01, 28d
    Smart Grocery Logic        :active, 2026-03-05, 20d
    Calendar Statistics        :2026-03-10, 15d

    section Phase 5: UI/HCI Refinement
    Visual Design System       :2026-03-12, 10d
    Screen Layout Impl         :2026-03-18, 12d
    Loading/Empty States       :2026-03-22, 8d
    Dark Mode                  :2026-03-28, 5d

    section Phase 6: Feature Completion
    Timer System Finalization  :2026-03-25, 10d
    Video Parsing              :crit, 2026-03-28, 12d
    Export Functionality       :2026-04-01, 8d
    Social Features            :2026-04-05, 10d

    section Phase 7: Testing
    User Testing Sessions      :2026-04-01, 12d
    Feedback Implementation    :2026-04-08, 12d
    Performance Optimization   :2026-04-10, 10d
    Cross-device Testing       :2026-04-15, 8d

    section Phase 8: Final Deliverables
    Documentation              :2026-04-15, 10d
    Presentation Prep          :2026-04-18, 8d
    Demo Video                 :2026-04-22, 5d
    Final Submission           :milestone, 2026-04-28, 1d
```

---

### How to Use These in Your Report

1. **If using LaTeX with the `mermaid` package**:  
   Include `\usepackage{mermaid}` and then wrap the diagram in `\begin{mermaid}...\end{mermaid}`. You may need to enable shell-escape.

2. **If generating images externally**:  
   - Go to [Mermaid Live](https://mermaid.live/).  
   - Paste the code, adjust theme as needed, and export as PNG/SVG.  
   - Insert the image in your document with a caption.

3. **For the Gantt chart**, note that the `crit` tag highlights the video parsing task as delayed (shown in red). The current date (Mar 10) is not automatically marked, but you can add a vertical line in your image editor if needed.

These diagrams will give your progress report a professional, visually clear representation of your project’s workflow and timeline.