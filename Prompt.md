# Prompts
## Prompt 1

We are going to brainstorm an app ui and function, I will give detail on the application, you will provide input and ask question to further define the application. You will then create an in depth prompt to give to Figma to create an ui for the application.

We are planning on making a cooking app that is capable of meal planning, calorie tracking, and creating a grocery list, but the primary function is to make following recipes and cooking easier. Each page will have a navbar at the bottom of the screen from left to right there will be button to: Go home, view calendar, add new recipe, view grocery list, and go to profile. This nav bar may change from screen to screen.

The main page will have all of the recipes for the user to see when a recipe is clicked it Wil open the recipe general instructions (time, ingredients, difficulty, a picture, etc.) then the user will click a button to begin recipe to open the recipe. This screen will have the name at the top with a picture and an ingredient list. The recipe will be divided into steps to make it easier for the user to process, at the beginning of the screen there will be a section for the timer and the ingredients for the section. Throughout the recipe whenever a timer is needed it will have a prompt to start timer which will cause the timer at the top to begin. 

The calendar view will allow users to add recipes to each day of the month for meal planning, the user can then click on days to view calories for the day and adjust what recipe is that day. The user can also add food for that day to track calories that they have not cooked, this will be color coded. 

The grocery list will automatically look at what is being cooked for the week and add the item to the grocery list, the user can also add recipes to the list independently, or just add individual items. The items will be sorted into predetermined tags which the user can edit for their own personal organization. There will also be an option to export the list, either to a note app, to send to others, or to an online shopping app if the user would like to have their groceries picked up or delivered. 

The profile will just have general info about the user (details to be determined)

Lastly the add recipe will prompt to input from text, image or video, but will also allow for manual input. The app will either us AI or ML to parse and create the recipe, once the recipe is generated the user can manually go through it and edit in case anything was parsed incorrectly. 

There will also be a back button in the top left of all sub menus to go to the previous screen

## Prompt 2

The app will be primarily for personal use, but now that you mention it, the users could add friends through the app to share recipes, and keep each other accountable on their goals. The profile will need to have dietary restrictions, and calorie goals to assist the user when filtering recipes.

For parsing the recipe, the ingredients are typically in text in a bulleted list, the steps will be more complicated, for text based, the instructions can be parsed, and using ai they can be seperated. For videos it is a little more complicated, but the video would stay with the recipe in the app for refrence while cooking. when editing the recipe it will be the entire screen, they will first be able to view the ingredients, then they will be able to go through each step in the instructions for verification, there should also be an easy way to bypass it, if the user would like to skip this step. The manual entry UI will be the basis for the editing UI, but when editing there will be info. The user should be able to edit any recipe incase they find an error at some point.

It should be a grid layout, with options to filter by user, or auto generated tags, there can also be an explore section to find new recipes. 

The user will tap a day which will cause the bottom half of the screen to become the calorie and meal tracker, they can then add meals there from their library. Color can be based on meal type (breakfast, lunch, dinner, desert, snack), or there can be no color coding (a default color), the color coding is for the user to determine for their own organization preference. Calorie tracking is a supplemntary feature, it will pull from a database based on the ingredients for accuracy. Calories will be per day, but the user can view overall trends in a statistics tab on the calender page.

The user can do all that you listed. the user can also edit everything (section labels, which item goes where, etc.) The user can also edit names of items instead of adding notes, so they could change the name from avocados to ripe avocados. This makes less popups, and the database a little easier.

The timer could show the one with the least time left on top, then when clicked it drops and shows all active timers. The timers will be slightly offset to show that there is a stack of multiple timers. The screen should stay on by default, but there should be a setting for power mode that causes it to shut off. There doesn't need to be a hands-free mode, but there will be different scroll modes, there will be a setting for that, but for now there will just be the default scroll. it can be a checklist to allow the user to mark it as included.

We won't have a tutorial for a while that will be added once it more complete. The items in the navbar will always be present and accessible regardless if they are empty or not.

All of the major numbered sections are adressed in each paragraph. For the name we already have the name SimpelChef, but that is tentative

# Instructions

UI/UX Design Prompt: SimpelChef Cooking App
1. Project Overview & Core Philosophy

App Name: SimpelChef
Tagline: Plan. Cook. Shop. Simplify.
Goal: Design a mobile-first cooking assistant that reduces friction in the entire cooking process—from discovering a recipe to having the groceries delivered. The primary user experience must be the step-by-step cooking mode, which should feel like a capable, calm kitchen assistant. Secondary pillars are intelligent meal planning and an auto-generating grocery list.

Design Principles:

    Clarity Over Clutter: Cooking is stressful; the interface must be calm and legible, especially during active cooking.
    Progressive Disclosure: Show only what the user needs at that moment (e.g., ingredients per step).
    Smart Defaults, Full Control: The app automates tedious tasks (list building) but allows users to edit every single piece of data.
    Visual Warmth: Use a warm, appetizing color palette. High-quality food imagery is key for inspiration.

2. Core User Flows to Design

    The Cooking Flow: Home -> Recipe Detail -> Step-by-Step Cooking Mode.

    The Planning Flow: Calendar -> Tap Day -> Add Meal from Library/Log Quick Food -> View Daily Nutrition.

    The Shopping Flow: Grocery List (auto-generated) -> Edit Items/Categories -> Export List.

    The Recipe Creation Flow: Add Recipe -> Input (Text/Image/Video/Manual) -> AI Parse & Edit Screens -> Save to Library.

3. Global Components & Navigation

    Dynamic Bottom Navigation Bar (Always Visible): 5 icons. Default state:

        Home (filled icon) | Calendar | + (Add Recipe, prominent) | Grocery Cart | Profile

    Context-Aware Nav Bar: In Step-by-Step Cooking Mode, this bar is replaced with: Timer List | Prev Step | Pause/Finish | Next Step | View All Ingredients.

    Global Header: A back button (<) in the top-left corner on all sub-screens (any screen deeper than the main 5 nav pages). The current screen title is centered.

4. Detailed Screen Specifications

A. Home Screen (Recipe Library)

    Layout: Responsive grid of recipe cards (2-3 columns). Card contains: Hero image, Recipe Title, Badges (e.g., "30 min", "Vegetarian", "Planned for Thu").

    Top Bar: Search bar + Filter button (opens drawer for: Dietary Restrictions [from profile], Cook Time, Difficulty, "My Recipes", "Friends' Recipes").

    Empty State: "No recipes yet. Tap '+' to add your first recipe!"

    Interaction: Tap card -> Recipe Detail Screen.

B. Recipe Detail Screen (General View)

    Layout: Scrollable. Hero image (full width), Title, Favorite button.

    Key Info Strip: Time (prep/cook/total), Difficulty, Servings, Total Calories.

    Expandable Sections:

        Ingredients: A clean list of items with quantities.

        Description/Notes: User-added context.

    Primary Action Button: Large, prominent "BEGIN COOKING" button at bottom -> Opens Step-by-Step Cooking Mode.

C. Step-by-Step Cooking Mode (The Core Experience)

    Layout: Fixed top section, scrollable main content.

    Top Bar (Fixed):

        Recipe Name & Step Progress (e.g., "Step 2 of 8").

        Timer Dock: Visualizes active timers as slightly offset, stacked cards. The top card shows the timer with the least time remaining. Tapping the dock expands a modal with all active timers (with labels like "Sauce Simmer") and controls (pause, cancel).

    Main Content Area (Per Step):

        Step Title & Number: Large.

        "Mise en Place" Section: Header: "Ingredients for this step". Checklist of items needed specifically for this step. Users can check off as they add them.

        Step Instructions: Clear, large typography. Any embedded timer triggers appear as a prominent button, e.g., "⏱️ Start 10-Minute Timer".

    Interaction: Scrolling reveals next/previous steps. The top "Mise en Place" section updates for each new step.

D. Calendar & Meal Planning Screen

    Top Half: Standard monthly calendar view. Days with planned meals show colored dots (user-configurable colors for meal types) or mini recipe images.

    Bottom Half (Dynamic): Tapping a day populates this area.

        Day Header: Date, Total Calories (Consumed vs. Goal from Profile).

        Meal Cards: List of meals (Breakfast, Lunch, etc.). Each card shows Recipe Name (or "Quick Add: Oatmeal"), Calories, and a ... menu to edit/remove.

        Add Button (+): Opens action sheet: "Add from Recipe Library" (opens a filtered home view) | "Quick Add Food" (searchable database for calorie tracking).

    Top Bar Button: Statistics -> Opens a modal with weekly/monthly calorie & nutrition trends.

E. Grocery List Screen

    Header: "Your List for [Week of...]" with Export (Share Sheet) and Edit Categories buttons.

    Main List: Items grouped under user-editable categories (e.g., Produce, Dairy). Each item shows: Checkbox, Editable Name/Quantity field (e.g., "3 Tomatoes"), and a tag showing the source recipe (optional, tappable).

    Intelligent Features (Behind the scenes): Items from the weekly meal plan are auto-added, deduplicated, and smart-categorized. A user can long-press an item to drag between categories or edit details inline.

    Floating Action Button (+): "Add Individual Item" or "Add Recipe to List".

F. Add / Edit Recipe Flow

    Input Method Selection: Modal with 4 large buttons: Paste Text / URL, Upload Image, Upload Video, Enter Manually.

    Parsing / Creation Screen (for imports):

        Left Panel (Source): Shows the original text, uploaded image, or video player.

        Right Panel (Parsed Recipe): Editable fields populate as AI parses: Name, Ingredients list, Step-by-step instructions (already divided). A "Processing..." state is needed.

        Bottom Bar: Back | Verify & Edit (primary) | Save (skip verification).

    Verification & Edit Screen (Also used for Manual Entry):

        Tabbed interface: Ingredients | Instructions.

        Ingredients Tab: List of items with fields for Name, Quantity, Unit. Easy add/delete.

        Instructions Tab: List of steps. For each step: Text area, option to + Add Timer, and + Link Ingredients (to create the "Mise en Place" for that step).

        Top Section: Basic metadata (time, servings, image upload).

        Save/Cancel in top bar.

G. Profile Screen

    User Info: Photo, Name, Bio.

    Goals & Diet: Daily Calorie Goal (with edit), Toggle-able Dietary Restrictions (Vegetarian, Gluten-Free, etc., for filtering).

    Friends Section: List of added friends (avatars/names). Add Friend button.

    App Settings: Includes toggle for "Screen Always On During Cooking".

5. Visual Design Direction

    Primary Color: A warm, trustworthy color like #2E8B57 (Sea Green). Avoid overly bright reds.

    Secondary Color: A complementary neutral #3D405B (Deep Space) for text.

    Accent Color: A vibrant color #F4A261 (Sandy Yellow) for primary buttons and timers.

    Typography: A highly legible sans-serif (e.g., Inter or SF Pro Display). Hierarchy is critical in cooking mode.

    Imagery: Use placeholder food photography that feels homemade, bright, and inviting.

    Icons: Consistent, friendly line-icons with a slight rounded style.

6. Notes for the Designer

    Priority 1: The Step-by-Step Cooking Mode must be flawless. It's the app's hero moment. Prototype its timer interactions carefully.

    Priority 2: The Grocery List should feel intelligent but not magical—users must feel in control of every item.

    Edge Cases: Design empty states for all lists (Recipes, Calendar, Grocery). Design the "quick add" food logging modal.

    Figma Deliverables Expected: A component library (atoms: buttons, inputs; molecules: recipe cards; organisms: nav bars), wireframes for all flows, and a high-fidelity interactive prototype for the core Cooking Flow and Planning -> Grocery List Flow.