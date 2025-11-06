# SponsorCX Frontend Architecture

**Last Updated:** 2025-01-05
**Purpose:** Quick reference for AI to navigate codebase structure and patterns

---

## 📁 High-Level Structure

```
sponsorcx-frontend-mini/src/
├── components/          # React components (organized by feature)
├── services/           # API clients and external service integrations
├── utils/              # Pure utility functions and helpers
├── hooks/              # Reusable React custom hooks
├── constants/          # Static data, colors, configurations
└── types/              # TypeScript type definitions
```

---

## 🎯 Key Features & Locations

### **Dashboard System**
**Path:** `src/components/dashboard/`
- **Dashboard.tsx** - Main dashboard container with presentation mode & PDF generation
- **grid/DashboardGrid.tsx** - Responsive grid layout for graphs
- **grid/graph_card/** - Individual graph card component (refactored into folder)
- **context/** - Dashboard filter state management using React Context

### **Data Visualization**
**Path:** `src/components/visualizations/`
- **ChartRenderer.tsx** - Router component that selects correct chart type
- **charts/** - Individual chart implementations:
  - `MantineBarChart.tsx` - Bar charts with drill-down capability
  - `MantineLineChart.tsx` - Line charts with regression line support
  - `MantinePieChart.tsx` - Pie charts
  - `KPI.tsx` - Key performance indicator display
  - **drilldown/** - Drill-down UI components (extracted from BarChart)
  - **utils/** - Shared chart utilities (grid, colors, formatters, regression)

### **Data Transformation**
**Path:** `src/utils/chartDataTransformations/`
- **Purpose:** Converts Cube.js API responses into chart-compatible formats
- **Pattern:** Each chart type has dedicated transformation logic
- **Key Files:**
  - `transformations/` - Per-chart-type transformers
  - `core/` - Shared extraction and processing logic
  - `types.ts` - Shared type definitions

### **Backend Integration**
**Path:** `src/services/backendCube/`
- **executeCubeGraphQL()** - Main function to query Cube.js API
- **buildQueryFromTemplate()** - Converts dashboard templates to GraphQL queries
- **types.ts** - API response types and interfaces

---

## 🔧 Common Patterns

### **Custom Hooks Pattern**
Location: Component-specific hooks live in `{component}/hooks/`
```typescript
// Example: src/components/dashboard/grid/graph_card/hooks/useGraphData.ts
export function useGraphData(query: string, refreshKey?: number) {
  // Handles data fetching, caching, loading states
}
```

### **Utility Functions Pattern**
Location: `src/utils/` or component-specific `{component}/utils/`
```typescript
// AI-friendly structure:
/**
 * [One-line summary]
 *
 * @input param1: type - description
 * @output returnType - description
 * @example
 * // Input: x, y
 * // Output: z
 * functionName(x, y); // => z
 */
```

### **Component Composition Pattern**
Large components (>300 lines) should be refactored into:
```
component_name/
├── ComponentName.tsx    # Main component (~150-200 lines)
├── hooks/              # Custom hooks for logic
├── components/         # Sub-components for UI
├── utils/              # Component-specific utilities
└── index.ts            # Barrel export
```

---

## 🎨 Styling & UI

- **UI Library:** Mantine v7 (mantine.dev)
- **Icons:** Tabler Icons (`@tabler/icons-react`)
- **Charts:** Mantine Charts (wrapper around Recharts)
- **Styling:** Inline styles (no CSS modules currently)

---

## 🔑 Key State Management

### **Dashboard Filters**
- **Context:** `DashboardFilterProvider` in `src/components/dashboard/context/`
- **Pattern:** Global filters applied to all graphs on dashboard
- **Access:** `useDashboardFilterContext()` hook

### **Drill-Down State**
- **Location:** Graph card local state (managed by `useGraphDrillDown` hook)
- **Pattern:** Clicking bar → swap dimension → add filter → stack filters on subsequent drill-downs
- **Reset:** IconZoomReset button

### **Refresh Key Pattern**
- **Purpose:** Trigger all graphs to re-fetch data simultaneously
- **Mechanism:** Counter increments → all useEffect hooks with `refreshKey` dependency re-run
- **Location:** Dashboard.tsx state passed down to all GraphCards

---

## 📊 Data Flow

```
User Action
    ↓
Dashboard Component
    ↓
buildQueryFromTemplate() → GraphQL Query
    ↓
executeCubeGraphQL() → Cube.js API
    ↓
transformChartData() → Chart-compatible format
    ↓
ChartRenderer → Specific Chart Component
    ↓
Mantine Chart → Rendered Visualization
```

---

## 🚀 Recently Refactored

### **Chart Components** (2025-01-05)
- Extracted shared utilities to `/charts/utils/`:
  - `gridAxisHelpers.ts` - Grid line configuration
  - `colorPaletteHelpers.ts` - Color palette management
  - `chartFormatterHelpers.ts` - Number formatting
  - `regressionHelpers.ts` - Regression line calculations
- Extracted drill-down UI to `/charts/drilldown/`:
  - `useDrillDown.ts` - Hook for drill-down state
  - `DrillDownPanel.tsx` - Main drill-down UI
  - `BarSelectionView.tsx` - Bar selection screen
  - `DrillDownDimensionSelection.tsx` - Dimension picker

**Result:**
- MantineBarChart: 367 → 196 lines (47% reduction)
- MantineLineChart: 196 → 144 lines (27% reduction)
- Eliminated code duplication across all charts

### **GraphCard** (In Progress - 2025-01-05)
- **Status:** Moving to dedicated `graph_card/` folder
- **Target:** Extract hooks, components, utilities
- **Goal:** 424 → ~150 lines

---

## 🎯 AI Navigation Tips

### **Finding Code:**
- Chart logic: `src/components/visualizations/charts/`
- Data fetching: `src/services/backendCube/`
- Transformations: `src/utils/chartDataTransformations/`
- Dashboard: `src/components/dashboard/`

### **Common Tasks:**
- Adding new chart type: Create in `/charts/`, add to ChartRenderer.tsx
- Fixing data transformation: Check `/utils/chartDataTransformations/transformations/`
- Updating filters: Check `/dashboard/context/` and `/utils/filters/`
- Styling: Mantine props (inline) - see mantine.dev docs

---

## 📝 Code Style Guidelines

### **Comments for AI:**
```typescript
// ✅ GOOD - Standard JSDoc, concise, with examples
/**
 * Combines graph, dashboard, and drill-down filters
 *
 * @param graphFilters - Graph template filters
 * @param dashboardFilters - Global dashboard filters
 * @returns Combined FilterRule array
 *
 * @example
 * // Input: [{field: "status"}], [{field: "region"}]
 * // Output: [{field: "status"}, {field: "region"}]
 * combineAllFilters(graphFilters, dashboardFilters);
 */

// ❌ BAD - Too verbose, not scannable
/**
 * This function takes the filters from the graph template
 * and combines them with the active dashboard filters by
 * iterating through each array and merging them together
 * while checking for duplicates and...
 */
```

### **Function Organization:**
1. Exports at top
2. Type definitions
3. Main function with JSDoc
4. Helper functions below (if any)

### **Component Organization:**
1. Imports
2. Types/Interfaces
3. Component definition
4. Sub-components (if small)

---

## 🔄 Active Patterns to Follow

1. **Extract large components** (>300 lines) into dedicated folders
2. **Shared logic → custom hooks** (prefix with `use`)
3. **Complex calculations → utility functions** (pure functions)
4. **UI sections → sub-components** (keep composable)
5. **Always add JSDoc** with @input/@output for AI readability

---

*This document should be updated whenever significant architectural changes are made.*
