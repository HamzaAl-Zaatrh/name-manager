# Name Manager

A modern Angular 21 application for managing external investor groups with a focus on clean architecture, semantic HTML, and signal-based state management.

## Table of Contents

- [Key Features](#key-features)
- [Architecture Highlights](#architecture-highlights)
- [Navigation System](#navigation-system)
- [Layout System](#layout-system)
- [Development](#development)
- [Project Structure](#project-structure)
- [Best Practices Implemented](#best-practices-implemented)

---

## Key Features

### 1. External Investor Management (CRUD)
- **Create** new investor groups with validation
- **Read** and search through existing groups with real-time filtering
- **Update** investor information with partial updates
- **Delete** with confirmation dialogs
- **Auto-save** to localStorage on every operation
- **Search functionality** with case-insensitive filtering by name

### 2. Responsive Navigation System
- **Two-level navigation hierarchy**:
  - Header: Horizontal tabs for main sections (Dashboard, Settings)
  - Sidebar: Nested tree navigation for sub-sections
- **Dynamic active state tracking** using Angular Router
- **Collapsible sidebar** with smooth transitions
- **Signal-based state management** for reactive UI updates

### 3. RTL-Ready Interface
- **Full Arabic UI** with proper right-to-left layout
- All labels, buttons, and messages in Arabic
- Optimized for Arabic-speaking users

### 4. Modern Modal System
- **HTML5 `<dialog>` element** for native browser modals
- **Reusable modal component** with content projection
- **Specialized confirmation dialogs** for destructive actions
- **Signal-synchronized state** between component and DOM

### 5. Data Persistence
- **localStorage-based persistence** (no backend required)
- **Automatic persistence** on all CRUD operations
- **Seed data** provided for initial experience
- **Date serialization/deserialization** handled correctly

---

## Architecture Highlights

### Modern Angular Patterns

#### 1. Standalone Components
- **No NgModules** - All components are self-contained
- **Explicit imports** in each component
- **Better tree-shaking** and smaller bundle sizes
- **Clearer dependencies** and easier maintenance

```typescript
@Component({
  selector: 'app-external-investors',
  imports: [CommonModule, ReactiveFormsModule, Modal, Icon],
  standalone: true
})
```

#### 2. Signal-Based State Management
- **Signals for UI state** - Fast, granular reactivity
- **Computed signals** for derived values
- **Effect for side effects** - DOM synchronization
- **Better performance** than traditional change detection

```typescript
isOpen = signal(true);
searchTerm = signal('');
filteredData = computed(() =>
  this.data().filter(item => item.name.includes(this.searchTerm()))
);
```

#### 3. Observable + Signal Hybrid Pattern
- **Services use Observables** - For async data streams
- **Components use Signals** - For UI state
- **Bridge with `toSignal()`** - Best of both worlds

```typescript
// Service: Observable stream
investors$ = this.investorsSubject.asObservable();

// Component: Convert to signal
investors = toSignal(this.externalInvestorsService.filteredInvestors$, {
  initialValue: []
});
```

#### 4. OnPush Change Detection
- **All components use OnPush strategy**
- **Only rerender when signals change**
- **Significant performance improvements**
- **Explicit, predictable updates**

### Semantic HTML Usage

We prioritize semantic HTML elements for better accessibility, SEO, and code clarity:

#### Navigation Elements
```html
<!-- Header: Semantic navigation structure -->
<header class="header">
  <h1 class="app-title">السجلات</h1>
  <nav class="main-nav">
    <ul class="nav-tabs">
      <li class="nav-tab">...</li>
    </ul>
  </nav>
</header>

<!-- Sidebar: Proper aside + nav elements -->
<aside class="sidebar">
  <nav class="sidebar-nav">
    <div class="nav-group">
      <h3 class="nav-group-title">Group Name</h3>
      <ul class="nav-list">
        <li class="nav-item">
          <a class="nav-link">Link</a>
        </li>
      </ul>
    </div>
  </nav>
</aside>
```

#### Dialog Elements
```html
<!-- HTML5 dialog for modals (not divs!) -->
<dialog class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">{{ title() }}</h2>
      <button type="button" aria-label="إغلاق">...</button>
    </div>
    <ng-content />
  </div>
</dialog>
```

**Benefits of Semantic HTML:**
- Screen readers can properly navigate the structure
- Search engines understand content hierarchy
- Browser native features (dialog backdrop, ESC key handling)
- Cleaner, more maintainable code
- Proper heading hierarchy (h1 → h2 → h3)

---

## Navigation System

The navigation system uses a **two-tier architecture** with clear separation of responsibilities:

### Navigation Service (`NavigationService`)

**Location:** `src/app/core/services/navigation.service.ts`

**Responsibilities:**
- Centralized navigation configuration management
- Tracks current active section based on router state
- Provides reactive computed signals for navigation data
- Designed for future backend API integration

**Key Signals:**
```typescript
activeSection: Signal<string | null>           // Current main section ID
mainNavigation: Signal<NavigationSection[]>    // Top-level sections
activeSectionChildren: Signal<NavigationItem[]> // Sub-items for active section
```

**Data Flow:**
1. Router emits URL changes
2. Service extracts section from URL path
3. Signals automatically update
4. Components react to signal changes

### Header Component

**Location:** `src/app/layout/main-layout/header/header.ts`

**Responsibilities:**
- Display **main navigation sections** (Dashboard, Settings)
- Render horizontal tab navigation
- Show application title
- Display user profile information
- Highlight active section using `RouterLinkActive`

**What it manages:**
- Top-level navigation only (no nested items)
- Application-wide branding
- User context (name, avatar)

**Semantic Structure:**
```
<header>
  ├── <h1> - App title
  ├── User profile section
  └── <nav>
      └── <ul> - Main navigation tabs
```

### Sidebar Component

**Location:** `src/app/layout/main-layout/sidebar/sidebar.ts`

**Responsibilities:**
- Display **child navigation items** for the active section
- Support **multi-level hierarchies** (groups with nested items)
- Toggle visibility (collapsible)
- Provide context-specific navigation
- Handle empty states (hide if no children)

**What it manages:**
- Sub-navigation for the current main section only
- Navigation groups with headings
- Deep navigation trees (Settings → Transactions → External Investors)
- Sidebar open/closed state

**Semantic Structure:**
```
<aside>
  ├── <nav>
  │   └── For each group:
  │       ├── <h3> - Group title (e.g., "إدارة المعاملات")
  │       └── <ul>
  │           └── <li> - Navigation links
  └── <button> - Toggle sidebar button
```

**Conditional Rendering:**
```typescript
hasSidebarChildren = computed(() =>
  this.navigationService.activeSectionChildren().length > 0
);
```
The sidebar only renders when there are child items to display.

### Navigation Hierarchy Example

```
Header (Top-level):
├── لوحة القيادة (Dashboard)        ← No children, sidebar hidden
└── اعدادات النظام (Settings)       ← Has children, sidebar shows:

Sidebar (When Settings active):
└── إدارة المعاملات (Transactions Group)
    └── مجموعة المستثمرين للجهات الخارجية (External Investors)
```

### Why This Separation?

1. **Clear Responsibility Boundaries**
   - Header: "Where am I in the app?"
   - Sidebar: "Where can I go within this section?"

2. **Better UX**
   - Main sections always visible in header
   - Sidebar appears only when contextually relevant
   - Reduces visual clutter for sections without sub-navigation

3. **Scalability**
   - Easy to add new main sections (just update header)
   - Sub-sections don't clutter top navigation
   - Supports deep hierarchies without UI complexity

4. **Performance**
   - Sidebar only renders when needed
   - Computed signals ensure minimal re-renders
   - OnPush change detection strategy

---

## Layout System

### Main Layout Component

**Location:** `src/app/layout/main-layout/main-layout.ts`

**Structure:**
```
┌─────────────────────────────────────────────┐
│ Header (Fixed Top)                          │
│ - App Title | User Profile                  │
│ - Main Navigation Tabs                      │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │  Main Content Area              │
│ (Coll.)  │  <router-outlet />              │
│          │                                  │
│ - Context│  - Dashboard                    │
│   Nav    │  - OR Settings Pages            │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

**Composition:**
- Imports and uses Header, Sidebar, and RouterOutlet
- Provides consistent shell for all pages
- Handles responsive behavior

**Key Features:**
- Header is fixed/sticky
- Sidebar toggles without affecting layout flow
- Main content area scrolls independently
- CSS Grid or Flexbox for layout management

---

## Development

### Prerequisites
- Node.js (LTS version recommended)
- Angular CLI 21.0.4+

### Running the Application
```bash
# Start development server
ng serve
# OR
npm start

# Application runs on http://localhost:4200/
# Auto-reloads on file changes
```

### Building
```bash
# Production build (optimized)
ng build

# Development build
ng build --configuration development

# Watch mode (auto-rebuild)
ng watch

# Output directory: dist/
```

### Testing
```bash
# Run unit tests with Vitest
ng test
```

### Code Generation
```bash
# Generate a new component (standalone by default)
ng generate component <name> --project=name-manager

# Generate a service
ng generate service <name> --project=name-manager

# See all available schematics
ng generate --help
```

### Code Formatting
```bash
# Format all files with Prettier
npx prettier --write .

# Check formatting
npx prettier --check .
```

---

## Project Structure

```
src/app/
├── core/                           # Singleton services and models
│   ├── models/
│   │   ├── external-investor.model.ts   # Domain entity interface
│   │   └── navigation.model.ts          # Navigation type definitions
│   └── services/
│       ├── external-investors.service.ts # CRUD + persistence
│       └── navigation.service.ts         # Navigation state
│
├── features/                       # Lazy-loaded feature modules
│   └── main/
│       ├── dashboard/              # Dashboard page (placeholder)
│       └── settings/
│           └── external-investors/ # External investor CRUD
│               ├── external-investors.ts          # List view
│               └── add-external-investors/        # Add/Edit form
│
├── layout/                         # Application shell
│   └── main-layout/
│       ├── main-layout.ts          # Layout container
│       ├── header/                 # Top navigation bar
│       └── sidebar/                # Side navigation tree
│
├── shared/                         # Reusable components
│   └── components/
│       ├── modal/                  # Generic dialog wrapper
│       ├── delete-confirmation/    # Confirmation dialog
│       └── icon/                   # SVG sprite icon component
│
├── app.ts                          # Root component
├── app.config.ts                   # App providers
└── app.routes.ts                   # Root routing
```

### Path Aliases
```typescript
@app/*     → src/app/*
@core/*    → src/app/core/*
@auth/*    → src/app/features/auth/*
@env/*     → src/environments/*
@ui/*      → src/app/ui/*
```

---

## Best Practices Implemented

### 1. **Standalone Components Architecture**
- No NgModules - cleaner dependency management
- Explicit imports in each component
- Better tree-shaking and smaller bundles

### 2. **Signal-Based Reactivity**
- Signals for UI state (not RxJS for everything)
- Computed signals for derived values
- Effects for DOM synchronization
- Optimal performance with OnPush strategy

### 3. **Service Layer Pattern**
- Business logic isolated in services (`providedIn: 'root'`)
- Components are presentation-focused
- Clear separation of concerns
- Testable, reusable logic

### 4. **Form Validation Strategy**
- Reactive Forms (not template-driven)
- Validation in component, not service
- Type-safe form controls
- Reusable form components for add/edit modes

### 5. **Lazy Loading**
- Feature modules loaded on-demand via `loadChildren()`
- Components loaded with `loadComponent()`
- Reduced initial bundle size
- Faster time-to-interactive

### 6. **Semantic HTML**
- `<header>`, `<nav>`, `<aside>`, `<main>` for structure
- `<dialog>` for modals (native browser feature)
- `<h1>` - `<h3>` for proper heading hierarchy
- `<ul>`, `<li>` for navigation lists
- ARIA labels for accessibility

### 7. **TypeScript Strict Mode**
- All types explicitly defined
- No implicit `any`
- Null safety with strict null checks
- `noImplicitReturns` and `noFallthroughCasesInSwitch` enabled

### 8. **Component Communication**
- `input()` and `input.required()` signal functions for parent-to-child data
- `output()` signal functions for child-to-parent events (replaces EventEmitter)
- Services for cross-component state (Observables)
- Signals for local component state

### 9. **Routing Best Practices**
- Feature-based route organization
- Guards for route protection (prepared for auth)
- `runGuardsAndResolvers: 'always'` for reliable navigation
- Redirects for default routes

### 10. **Code Organization**
- Feature-based folder structure
- Shared components in `/shared`
- Core services in `/core`
- Layout components in `/layout`
- Clear naming conventions (PascalCase for files, kebab-case for selectors)

### 11. **Performance Optimizations**
- `OnPush` change detection on all components
- Lazy loading for features
- Signal-based reactivity (granular updates)
- TrackBy functions in `@for` loops
- Vite for fast development builds

### 12. **Accessibility**
- ARIA labels on interactive elements
- Semantic HTML for screen readers
- Keyboard navigation support (native dialog element)
- Proper heading hierarchy
- RTL support for Arabic users

---

## Technology Stack

- **Framework:** Angular 21
- **Language:** TypeScript 5.7+
- **Build Tool:** Vite
- **Bundler:** esbuild
- **Testing:** Vitest
- **State Management:** Signals + RxJS
- **Forms:** Reactive Forms
- **Styling:** SCSS
- **Icons:** SVG Sprite
- **Persistence:** localStorage (no backend)

---

## Future Enhancements

### Planned Features
- Authentication and authorization system
- Backend API integration (replace localStorage)
- Transaction management module
- Contract tracking
- Reporting and analytics dashboard
- Internationalization (i18n) with language switcher
- Export functionality (PDF, Excel)
- Advanced search and filtering
- Audit logs and change history

### Technical Improvements
- Unit test coverage with Vitest
- E2E testing setup
- CI/CD pipeline
- Docker containerization
- Environment-based configuration
- Error tracking integration
- Performance monitoring

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

The application uses modern browser features like the `<dialog>` element, which is supported in all modern browsers.

---

## License

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

---

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
