# Testing Guide - Backend Migration

## Quick Start

### 1. Ensure Backend is Running

```bash
cd sponsorcx-backend-mini
yarn dev
```

Verify backend is healthy:
```bash
curl http://localhost:8080/health
# Should return: {"status":"ok",...}
```

### 2. Start Frontend

```bash
cd sponsorcx-frontend-mini
yarn dev
```

Open browser to: http://localhost:3000

## Testing Scenarios

### Test 1: Create a New Graph

**Steps:**
1. Click "Add Graph" or "Create Graph" button
2. Select a view (e.g., "Campaigns")
3. Select measures and dimensions
4. Click "Run Query"
5. Choose a chart type (e.g., "Bar Chart")
6. Configure chart settings
7. Click "Save"

**Expected Result:**
- Graph should appear on dashboard
- Browser console should show GraphQL mutation being called
- Page reload should still show the graph (data persisted to backend)

**Check Backend:**
```bash
# In another terminal
psql -U sponsorcx_user -d sponsorcxdb -c "SELECT id, name, chart_type FROM graphs ORDER BY created_at DESC LIMIT 1;"
```

### Test 2: Edit an Existing Graph

**Steps:**
1. Click edit icon on any graph card
2. Modify chart settings (e.g., change title, colors)
3. Click "Save"

**Expected Result:**
- Changes should appear immediately on dashboard
- Page reload should show updated graph

**Check Backend:**
```bash
psql -U sponsorcx_user -d sponsorcxdb -c "SELECT id, name, updated_at FROM graphs ORDER BY updated_at DESC LIMIT 1;"
```

### Test 3: Delete a Graph

**Steps:**
1. Click delete icon on any graph card
2. Confirm deletion

**Expected Result:**
- Graph should disappear from dashboard
- Page reload should not show the deleted graph

**Check Backend:**
```bash
# Check graph is gone
psql -U sponsorcx_user -d sponsorcxdb -c "SELECT COUNT(*) FROM graphs;"
```

### Test 4: Drag and Drop Grid Layout

**Steps:**
1. Drag a graph to a new position on the dashboard grid
2. Reload the page

**Expected Result:**
- New position should be maintained after reload

**Check Backend:**
```bash
psql -U sponsorcx_user -d sponsorcxdb -c "SELECT graph_id, grid_column, grid_row FROM dashboard_grid_items;"
```

### Test 5: Resize Graph

**Steps:**
1. Resize a graph by dragging its corner/edge
2. Reload the page

**Expected Result:**
- New size should be maintained after reload

**Check Backend:**
```bash
psql -U sponsorcx_user -d sponsorcxdb -c "SELECT graph_id, grid_width, grid_height FROM dashboard_grid_items;"
```

### Test 6: Dashboard Filters

**Steps:**
1. Open dashboard filters panel
2. Select views and add filters
3. Apply filters
4. Reload the page

**Expected Result:**
- Filters should still be applied after reload

**Check Backend:**
```bash
psql -U sponsorcx_user -d sponsorcxdb -c "SELECT dashboard_id, selected_views, active_filters FROM dashboard_filters;"
```

## Common Issues & Solutions

### Issue: "No dashboard selected" error

**Solution:** The app should automatically create a default dashboard. Check browser console for errors.

```bash
# Manually create a dashboard if needed
psql -U sponsorcx_user -d sponsorcxdb -c "INSERT INTO dashboards (name, layout) VALUES ('Main Dashboard', 'grid') RETURNING *;"
```

### Issue: Graphs not loading

**Solution:** Check that dashboard_grid_items are linking graphs to dashboard.

```bash
# Check relationships
psql -U sponsorcx_user -d sponsorcxdb -c "
  SELECT
    d.name as dashboard_name,
    g.name as graph_name,
    dgi.graph_id
  FROM dashboards d
  LEFT JOIN dashboard_grid_items dgi ON d.id = dgi.dashboard_id
  LEFT JOIN graphs g ON dgi.graph_id = g.id;
"
```

### Issue: Backend connection errors

**Solution:** Verify backend is running and VITE_API_URL is correct.

```bash
# Check frontend env
cat sponsorcx-frontend-mini/.env | grep VITE_API_URL

# Test backend
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

## Database Inspection

### View All Data

```bash
# Connect to database
psql -U sponsorcx_user -d sponsorcxdb

# List all graphs
SELECT id, name, chart_type, created_at FROM graphs;

# List all dashboards
SELECT id, name, layout, created_at FROM dashboards;

# List grid items
SELECT id, dashboard_id, graph_id, grid_column, grid_row FROM dashboard_grid_items;

# List filters
SELECT id, dashboard_id, selected_views FROM dashboard_filters;
```

### Reset Database (Start Fresh)

```bash
psql -U sponsorcx_user -d sponsorcxdb

-- Delete all data
DELETE FROM dashboard_filters;
DELETE FROM dashboard_grid_items;
DELETE FROM graphs;
DELETE FROM dashboards;

-- Verify clean state
SELECT 'graphs: ' || COUNT(*) FROM graphs
UNION ALL SELECT 'dashboards: ' || COUNT(*) FROM dashboards
UNION ALL SELECT 'grid_items: ' || COUNT(*) FROM dashboard_grid_items
UNION ALL SELECT 'filters: ' || COUNT(*) FROM dashboard_filters;
```

## Browser Developer Tools

### Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "graphql"
4. Perform an action (create/edit/delete graph)
5. Click on the GraphQL request to see:
   - Request payload (GraphQL query/mutation)
   - Response data
   - Any errors

### Check Console Logs

The application logs all backend API calls in development mode:
- `📡 Backend GraphQL Request: POST /graphql`
- `✅ Backend GraphQL Response: POST /graphql`

### Check Application State

Open React DevTools to inspect:
- OrganizationContext values (organizationId, dashboardId)
- Hook state (useDashboardState, useDashboardFilters)

## Performance Testing

### Load Time

Test how fast the dashboard loads:

**Option 1: Navigation Timing API** (run after page loads)
```javascript
// In browser console, AFTER page has loaded:
const perfData = performance.getEntriesByType("navigation")[0];
console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
console.log('DOM ready:', perfData.domContentLoadedEventEnd - perfData.fetchStart, 'ms');
console.log('Details:', {
  DNS: perfData.domainLookupEnd - perfData.domainLookupStart,
  TCP: perfData.connectEnd - perfData.connectStart,
  Request: perfData.responseStart - perfData.requestStart,
  Response: perfData.responseEnd - perfData.responseStart,
  DOM: perfData.domComplete - perfData.domInteractive
});
```

**Option 2: Measure on Next Reload** (run before reloading)
```javascript
// In browser console, BEFORE reloading:
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType("navigation")[0];
  console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
});
window.location.reload();
```

### Network Latency

Check GraphQL request timing in Network tab:
- Time to First Byte (TTFB)
- Total request time
- Payload size

## Success Criteria

✅ All graphs persist across page reloads
✅ Grid layout changes persist across page reloads
✅ Dashboard filters persist across page reloads
✅ No localStorage keys are created (check Application > Local Storage in DevTools)
✅ All CRUD operations work (Create, Read, Update, Delete)
✅ No TypeScript errors in build
✅ No console errors during normal usage
✅ Backend GraphQL queries/mutations succeed

## Next Steps After Testing

1. **Clear Old localStorage** (optional): Remove any old localStorage keys from previous version
2. **Remove Deprecated Files**: Delete localStorage utility files
3. **Add User Authentication**: Implement proper user/org management
4. **Add Error Boundaries**: Better error handling in React components
5. **Add Loading Skeletons**: Improve UX during data fetching
6. **Optimize Queries**: Add pagination for large datasets
7. **Add Caching**: Implement Apollo Client or React Query for better caching

Happy Testing! 🚀
