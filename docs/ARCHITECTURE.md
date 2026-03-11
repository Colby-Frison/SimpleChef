# SimpleChef - System Architecture

## 1. Architectural Patterns
The system follows a **Client-Server** architecture with a **Layered** approach to ensure high cohesion and low coupling.

- **Frontend:** React Native (Expo) for cross-platform mobile/web support.
- **Backend:** Python (FastAPI) for high performance and AI integration.
- **Database:** PostgreSQL for structured relational data.

## 2. Tech Stack

### Frontend (Client)
- **Framework:** React Native with Expo (Managed Workflow).
- **Language:** TypeScript.
- **State Management:** React Query (Server state) + Zustand or Context API (Client state/Timers).
- **UI Component Library:** React Native Paper or Tamagui for responsive design.
- **Navigation:** Expo Router / React Navigation.

### Backend (Server)
- **Framework:** FastAPI (Python).
- **ORM:** SQLAlchemy or Prisma (Python client) / SQLModel.
- **Authentication:** OAuth2 with JWT (JSON Web Tokens).
- **AI Integration:** OpenAI API / LangChain for recipe parsing.

### Infrastructure & DevOps
- **Containerization:** Docker for backend and database.
- **Storage:** AWS S3 (or compatible) for image/video storage.

## 3. System Modules (Separation of Concerns)

### 3.1. Frontend Modules
- **`app/`**: Route handlers (Expo Router).
- **`components/`**: Reusable UI components (Atoms, Molecules).
- **`features/`**: Feature-specific logic (Cooking, Planning, Recipes).
- **`services/`**: API clients and adapters.
- **`store/`**: Global state management.

### 3.2. Backend Modules
- **`api/`**: Route controllers.
- **`core/`**: Config, Security, Database connection.
- **`models/`**: Database schemas (SQLAlchemy/Pydantic).
- **`services/`**: Business logic.
    - `AuthService`: User management.
    - `RecipeService`: CRUD and AI parsing logic.
    - `PlannerService`: Calendar and Meal tracking.
    - `ShoppingService`: List generation and management.
- **`schemas/`**: Pydantic models for request/response validation.

## 4. Data Flow
1.  **Recipe Creation:** User uploads image -> Backend receives -> AI Service parses -> Returns draft -> User verifies -> Backend saves to DB.
2.  **Meal Planning:** User adds recipe to date -> PlannerService updates `DailyPlan` -> Triggers `ShoppingService` to update `GroceryList`.
3.  **Cooking:** Frontend manages Timer state locally (persisted if app backgrounded) -> Updates progress to Backend.

## 5. ERD (Entity Relationship Diagram) Concept
- **User** (1) <--> (N) **Recipe**
- **User** (1) <--> (N) **MealPlan**
- **MealPlan** (1) <--> (N) **Recipe**
- **Recipe** (1) <--> (N) **Ingredient**
- **User** (1) <--> (1) **GroceryList**
- **GroceryList** (1) <--> (N) **GroceryItem**
