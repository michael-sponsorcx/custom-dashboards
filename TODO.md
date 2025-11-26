# TODO

## Performance Optimization: Lazy Loading Graph Components

### Context
The dashboard can display many graphs simultaneously. Currently, all graphs render at once when the dashboard loads, which causes performance issues:

- **Current bottleneck**: Rendering cost, not query cost
  - Query time: ~50-200ms (even for 20 graphs)
  - Render time: ~2000ms+ (20 complex charts rendering simultaneously)
  - Browser main thread blocks during bulk rendering
  - Poor perceived performance and delayed initial paint

### Key Insights

#### 1. Rendering is the bottleneck, not data fetching
The GraphQL field resolver (in `sponsorcx-backend-mini/src/graphql/types.ts:137-186`) fetches all graph data upfront when the query executes, regardless of component visibility. This is intentional and acceptable - **the rendering is the bottleneck, not the data fetching.**

#### 2. Data fetching strategy considerations

**Current approach: Fetch ALL graph data upfront**
```graphql
query {
  dashboardGridItems(dashboardId: "123") {
    id
    graphId
    graph {  # ← Field resolver fetches ALL graphs
      id
      name
      chartType
      # ... all fields
    }
  }
}
```

**Pros:**
- All data available immediately (no loading states when scrolling)
- Simple implementation
- Works well for small-medium dashboards (< 50 graphs)
- Query time is still fast (~50-200ms even for 20 graphs)

**Alternative approach: Fetch graph data on-demand**
```graphql
# Initial query - just get grid items with IDs
query {
  dashboardGridItems(dashboardId: "123") {
    id
    graphId  # ← Only get IDs
  }
}

# Later - fetch individual graphs when needed
query {
  graph(id: "graph-123") {
    id
    name
    chartType
    # ... all fields
  }
}
```

**Pros:**
- Faster initial page load
- Better for very large dashboards (100+ graphs)
- Network bandwidth savings if user doesn't scroll

**Cons:**
- More complex implementation
- Loading states when scrolling
- Multiple round trips to server
- Potential for request waterfalls

**Recommendation:** Keep current approach (fetch all data upfront) and optimize rendering with lazy component loading. The query performance is acceptable, and having all data ready prevents loading spinners during user interaction.

### Proposed Solutions

#### Option 1: Intersection Observer (Recommended for scroll-based loading)
- Only render graphs when they scroll into viewport
- Use `IntersectionObserver` API with `rootMargin` for preloading
- Show skeleton placeholders for unrendered graphs
- Once rendered, keep mounted (disconnect observer)

#### Option 2: Progressive Loading (Recommended for initial load)
- Load graphs in batches with staggered rendering
- Example: Render 3-5 graphs immediately, then progressively load rest
- Use `setTimeout` or `requestIdleCallback` to batch renders
- Prevents blocking main thread

#### Option 3: React.lazy + Suspense
- Code-split heavy chart components
- Lazy load chart rendering logic per chart type
- Use `<Suspense fallback={<Skeleton />}>`

#### Option 4: Virtualization (For 50+ graphs)
- Use `react-window` or `react-virtualized`
- Only render graphs in viewport + buffer
- Best for very large dashboards

### Recommended Implementation: Hybrid Approach

Combine Options 1 + 2 for optimal UX:

```typescript
// 1. Progressive loading for above-the-fold (first 5 graphs)
// 2. Intersection Observer for below-the-fold (remaining graphs)

const INITIAL_LOAD = 5;

function Dashboard() {
  const { graphs } = useDashboardState();

  return (
    <>
      {/* Load first 5 immediately */}
      {graphs.slice(0, INITIAL_LOAD).map(item => (
        <GraphCard key={item.id} item={item} />
      ))}

      {/* Lazy load rest on scroll */}
      {graphs.slice(INITIAL_LOAD).map(item => (
        <LazyGraph key={item.id} item={item}>
          <GraphCard item={item} />
        </LazyGraph>
      ))}
    </>
  );
}
```

### Expected Performance Impact
- **Before**: 20 graphs × 100ms = 2000ms blocking time
- **After**: 5 graphs × 100ms = 500ms initial load
- **Result**: 4x faster time-to-interactive

### Implementation Files
- Create: `sponsorcx-frontend-mini/src/components/dashboard/LazyGraph.tsx` (Intersection Observer wrapper)
- Create: `sponsorcx-frontend-mini/src/hooks/useProgressiveLoad.ts` (Progressive loading hook)
- Modify: `sponsorcx-frontend-mini/src/components/dashboard/Dashboard.tsx` (Apply lazy loading)

### Next Steps
1. Implement `LazyGraph` component with Intersection Observer
2. Implement `useProgressiveLoad` hook
3. Update Dashboard component to use hybrid approach
4. Test with 20+ graphs to measure performance improvement
5. Consider adding loading analytics to track render times

### Related Files
- Backend GraphQL resolver: `sponsorcx-backend-mini/src/graphql/types.ts:137-186`
- Dashboard state hook: `sponsorcx-frontend-mini/src/components/dashboard/hooks/useDashboardState.ts`
- Dashboard component: `sponsorcx-frontend-mini/src/components/dashboard/Dashboard.tsx`

---

## Testing Strategy Review - Key Findings

### Overall Assessment: 6/10
Good foundation with practical prioritization, but needs expansion for production readiness.

### ✅ Strengths
- Sensible prioritization (utilities → services → hooks → components)
- Existing test infrastructure (Vitest + Jest configured)
- Conservative 5-10 test start for momentum
- Mock-first approach for isolation

### ❌ Critical Gaps

#### 1. Missing Test Coverage Strategy
- **Issue**: No coverage targets or measurement plan
- **Add**:
  - Utils: 80% coverage
  - Services: 70% coverage
  - Hooks: 60% coverage
  - Components: 40% coverage
  - Configure coverage reporting in Vitest/Jest

#### 2. No Integration Testing Layer
- **Issue**: Unit tests alone won't catch boundary bugs
- **Add**: Integration tests for:
  - Frontend: API client + state management
  - Backend: GraphQL resolver + database layer (with test DB)
  - Critical flow: Dashboard filters → query generation → data transformation

#### 3. Missing E2E Strategy
- **Issue**: No end-to-end testing for critical user journeys
- **Add**: Minimal E2E suite (Playwright/Cypress)
  - Login → View Dashboard
  - Create Graph → Save → View in Dashboard
  - Apply Filter → Verify Data Updates
  - Run in CI before deploys
  - Keep to <10 tests total

#### 4. Incomplete Test Categories
- **Issue**: Only happy path testing planned
- **Add**:
  - Error handling tests (API errors, timeouts, rate limits)
  - Edge cases (empty arrays, null values, malformed data)
  - Performance/regression tests

#### 5. No Regression Testing Protocol
- **Issue**: No strategy to prevent fixed bugs from reoccurring
- **Add**:
  - Every bug fix MUST include a regression test
  - Test should fail before fix, pass after
  - Label tests with issue numbers: `test('fixes #123: ...', ...)`

#### 6. Missing Data Contract Tests
- **Issue**: App transforms Cube API data through multiple layers, no validation
- **Add**:
  - Schema validation for Cube API responses
  - Chart data transformation invariants
  - Filter query generation correctness
  - Snapshot tests for complex transformations

#### 7. No Testing Anti-Patterns Guidance
- **Add**: "What NOT to Test" section
  - ❌ Don't test: Third-party libraries, trivial getters/setters, CSS/styling, console logs
  - ✅ Do test: Business logic, data transformations, error boundaries, security-sensitive code

#### 8. Missing Test Maintenance Strategy
- **Issue**: Tests become stale without discipline
- **Add**:
  - Review test failures within 1 hour
  - Refactor tests when code changes (not "skip and fix later")
  - Delete tests for removed features immediately
  - Keep test runtime under 30s for unit tests
  - Weekly: Run coverage report, identify gaps

#### 9. Weak Backend Testing Plan
- **Issue**: "Mock database calls" too vague
- **Strengthen**:
  - Unit: Resolvers with mocked DB
  - Integration: Real test database with fixtures (docker-compose PostgreSQL)
  - Contract: GraphQL schema validation (types, pagination, filtering)

#### 10. No CI/CD Integration
- **Critical**: Tests useless if not run automatically
- **Add**:
  - Run on every PR: Unit + Integration tests
  - Required: All tests pass before merge
  - Run on main: Full suite + E2E
  - Generate coverage reports in CI
  - Block deploys if critical tests fail

#### 11. Missing Performance Benchmarks
- **Add** (optional but valuable):
  - Benchmark chart transformations with large datasets
  - Test dashboard load time with 20+ graphs
  - Memory leak detection in useGraphState hook
  - API response time assertions (< 500ms)

#### 12. No Accessibility Testing
- **Add** (Priority 3):
  - @axe-core/react for automated checks
  - Keyboard navigation in dashboard
  - Screen reader compatibility for chart data tables
  - Color contrast for chart palettes

### Revised Priority Order
1. **Utility Functions** ✅
2. **Data Contract Tests** 🆕
3. **Services + Integration** ⬆️
4. **Custom Hooks** ✅
5. **GraphQL Resolvers + DB Integration** ⬆️
6. **Critical Component Tests** ✅
7. **E2E Smoke Tests** 🆕
8. **Performance Benchmarks** 🆕 (optional)

### Test Pyramid Recommendation
- 60% Unit tests (utils, pure functions)
- 30% Integration tests (API + transformations)
- 10% E2E tests (critical user flows)

### Next Actions
1. Update `.claude/TESTING_STRATEGY.md` with these improvements
2. Create test fixtures: `/tests/fixtures/cubeResponses.ts`, `/dashboards.ts`, `/graphs.ts`
3. Set up CI/CD configuration for automated testing
4. Implement incrementally - don't try everything at once

### Red Flags to Watch
- Test coverage gaming (hitting 80% by testing trivial code)
- Flaky tests (fix immediately if tests fail randomly)
- Slow tests (investigate parallelization if suite takes >1min)
- Coupling (tests breaking when unrelated code changes)
- Mocking overuse (tests that mock everything test nothing)

---

## Enum Architecture Refactoring

### Context
The current enum handling between frontend and backend has architectural friction. The frontend uses a mapper (`graphInputMapper.ts`) to convert between frontend chart types and backend GraphQL enum types.

### Current Architecture Issues

**Problem**: Frontend has to map enums both ways
- Frontend sends: `'stackedBar'` → mapper converts to → `BackendChartType.StackedBar` → GraphQL sends `'STACKED_BAR'`
- Frontend receives: `'STACKED_BAR'` → mapper converts to → `'stackedBar'`

**Files Affected**:
- `sponsorcx-frontend-mini/src/services/backendCube/utils/graphInputMapper.ts`
  - `mapChartType()` - Frontend to backend mapping
  - `mapBackendChartType()` - Backend to frontend mapping
  - Similar mappings for: `SortOrder`, `NumberFormat`, `LegendPosition`
- `sponsorcx-backend-mini/src/graphql/types.ts`
  - `ChartTypeEnum` (lines 17-32)
  - `NumberFormatEnum` (lines 31-39)
  - `SortOrderEnum` (lines 41-47)
  - `LegendPositionEnum` (lines 49-56)

### Proposed Architecture

**Better approach**: Backend as translation layer
- Frontend sends/receives clean simple strings: `'bar'`, `'stackedBar'`, `'horizontalBar'`
- Backend GraphQL schema accepts/returns same format
- Backend translates to Cube format only when talking to Cube API (if Cube needs different format)
- No frontend mapping needed

### Benefits
1. **Simpler Frontend**: No mapper needed, use GraphQL types directly
2. **Separation of Concerns**: Frontend doesn't know about Cube's data format
3. **Backend Encapsulation**: All Cube-specific translation happens in backend Cube proxy layer
4. **Type Safety**: GraphQL schema uses string literals that match frontend exactly

### Tasks

1. **Audit all enums and their string mappings in graphInputMapper.ts**
   - Document current ChartType mappings
   - Document SortOrder mappings
   - Document NumberFormat mappings
   - Document LegendPosition mappings
   - Identify all places these mappers are used

2. **Document current enum architecture and identify mapping friction points in graphInputMapper**
   - Map the data flow: Frontend → Mapper → GraphQL → Backend → Database → Cube
   - Identify unnecessary transformations
   - Document GraphQL codegen behavior (uppercase enum keys)

3. **Decide on clean enum strategy for graphInputMapper**
   - Option A: Keep current architecture (frontend mapping)
   - Option B: Move to backend translation layer (recommended)
   - Consider GraphQL codegen configuration options
   - Consider impact on existing data in database

4. **Refactor graphInputMapper.ts to eliminate unnecessary frontend mappers**
   - Update backend GraphQL schema if needed
   - Update backend resolvers to handle translation
   - Remove frontend mappers
   - Update all hooks/components using mappers
   - Regenerate GraphQL types
   - Test data round-trips correctly

### Related Files
- Frontend mapper: `sponsorcx-frontend-mini/src/services/backendCube/utils/graphInputMapper.ts`
- Backend schema: `sponsorcx-backend-mini/src/graphql/types.ts`
- Backend codegen: `sponsorcx-backend-mini/codegen.ts`
- Frontend types: `sponsorcx-frontend-mini/src/types/backend-graphql.ts` (generated)

---

## Pending Tasks

### 🗑️ Remove Deprecated localStorage Utilities

**Status**: Ready for cleanup after testing
**Priority**: Low (code works without these files)
**Date Added**: 2025-11-10

#### Files to Remove

All localStorage state management has been migrated to backend PostgreSQL. These files are deprecated:

1. **`sponsorcx-frontend-mini/src/utils/storage/graphStorage.ts`**
   - 58 lines
   - Functions: `saveGraphTemplate`, `getAllGraphTemplates`, `getGraphTemplate`, `deleteGraphTemplate`, `generateGraphId`
   - Replaced by: `services/backendCube/api/graphs.ts`

2. **`sponsorcx-frontend-mini/src/utils/storage/dashboardStorage.ts`**
   - 143 lines
   - Functions: `saveDashboard`, `getDashboard`, `addGraphToDashboard`, `removeGraphFromDashboard`, `saveGridLayout`, `getGridLayout`, `deleteGridLayout`, `getDashboardItem`, `getAllDashboardItems`
   - Replaced by: `services/backendCube/api/dashboards.ts`

3. **`sponsorcx-frontend-mini/src/utils/storage/index.ts`**
   - 30 lines
   - Barrel export file for localStorage utilities
   - Replaced by: `services/backendCube/index.ts` (exports new API functions)

4. **`sponsorcx-frontend-mini/src/services/dashboardFilterPersistence.ts`**
   - 58 lines
   - Functions: `loadDashboardFilters`, `saveDashboardFilters`, `clearDashboardFilters`
   - Replaced by: `services/backendCube/api/filters.ts`

#### Cleanup Commands

```bash
cd sponsorcx-frontend-mini

# Remove localStorage utility files
rm src/utils/storage/graphStorage.ts
rm src/utils/storage/dashboardStorage.ts
rm src/utils/storage/index.ts
rmdir src/utils/storage  # Remove empty directory

# Remove old filter persistence service
rm src/services/dashboardFilterPersistence.ts

# Verify no imports remain (should return nothing)
grep -r "from.*utils/storage" src/
grep -r "from.*dashboardFilterPersistence" src/

# Run build to verify no broken imports
yarn build
```

#### Verification Checklist

Before removing files, verify:
- [ ] No imports from `utils/storage` in codebase
- [ ] No imports from `dashboardFilterPersistence` in codebase
- [ ] All dashboard operations work with backend
- [ ] Graph creation/editing/deletion works
- [ ] Grid layout drag/drop persists across reloads
- [ ] Dashboard filters persist across reloads
- [ ] No localStorage keys being created (check DevTools > Application > Local Storage)

#### Migration Benefits Summary

- **Total lines removed**: ~289 lines of deprecated code
- **localStorage → PostgreSQL**: All state now in database
- **Multi-device sync**: Dashboard state accessible from any device
- **No cache issues**: Data persists even if browser storage is cleared
- **Ready for multi-tenant**: Organization and dashboard IDs in place

#### Related Documentation

- See [LOCALSTORAGE_TO_BACKEND_MIGRATION.md](LOCALSTORAGE_TO_BACKEND_MIGRATION.md) for full migration details
- See [TESTING_GUIDE.md](TESTING_GUIDE.md) for testing procedures

---

## Completed Tasks

### ✅ localStorage to Backend Migration
**Date**: 2025-11-10
**Status**: Complete
**Changes**:
  - Created new backend API services: graphs.ts, dashboards.ts, filters.ts
  - Updated all hooks to use backend instead of localStorage
  - Added organization/dashboard ID management via Zustand store
  - All CRUD operations now persist to PostgreSQL
  - Build verified successfully
**Benefits**:
  - Dashboard state survives browser cache clears
  - Cross-device synchronization ready
  - Multi-tenant support infrastructure in place
  - Data backed up in PostgreSQL database

### ✅ Zustand Store Migration
- **Date**: 2025-11-10
- **Status**: Complete
- **Changes**:
  - Migrated from React Context API to Zustand for organization/dashboard state
  - Renamed `contexts/` → `store/`
  - Renamed `OrganizationContext.tsx` → `organizationStore.ts`
  - Created barrel export file `store/index.ts`
  - Updated all imports across 4 hook files
  - Removed Provider wrapper from App.tsx
  - Build verified successfully
- **Benefits**:
  - 65% reduction in code (43 lines removed)
  - Better performance (selective re-renders)
  - No Provider wrapper needed
  - Cleaner API for global state
- **Pattern**: Using Approach 1 (Single Store File) for scalability


refeactor dashbaord cube backend 
operator cache and other caches can have a separate caching strategy
