# Backend GraphQL Types Usage

This file is **auto-generated** from the backend GraphQL schema and synced to the frontend.

## Updating Types

When the backend schema changes, run:

```bash
cd sponsorcx-backend-mini
yarn codegen:sync
```

This will:
1. Generate types from the GraphQL schema
2. Copy them to `frontend/src/types/backend-graphql.ts`
3. Commit both files to git

## Using Types in Frontend

```typescript
import { Graph, Dashboard, ChartType } from '@/types/backend-graphql';
import { executeBackendGraphQL } from '@/services/backendCube/core/backendClient';

// Query with type safety
const result = await executeBackendGraphQL<{ graphs: Graph[] }>(`
  query {
    graphs {
      id
      name
      chartType
      chartTitle
    }
  }
`);

// TypeScript knows the structure
const graphs: Graph[] = result.data?.graphs || [];
graphs.forEach(graph => {
  console.log(graph.chartType); // ✅ Autocomplete works!
});
```

## Example: Create Graph Mutation

```typescript
import { GraphInput, Graph } from '@/types/backend-graphql';

const createGraph = async (input: GraphInput) => {
  const result = await executeBackendGraphQL<{ createGraph: Graph }>(`
    mutation CreateGraph($input: GraphInput!) {
      createGraph(input: $input) {
        id
        name
        chartType
      }
    }
  `, { input });

  return result.data?.createGraph;
};

// TypeScript validates the input
const newGraph = await createGraph({
  name: 'Sales Chart',
  viewName: 'sales_view',
  chartType: 'BAR',
  chartTitle: 'Monthly Sales',
  measures: ['revenue'],
  dimensions: ['month'],
});
```

## Available Types

All GraphQL types are available:

### Entities
- `Graph` - Chart/graph configuration
- `Dashboard` - Dashboard entity
- `DashboardGridItem` - Graph on dashboard
- `DashboardFilter` - Dashboard filters

### Inputs
- `GraphInput` - Create/update graph
- `DashboardInput` - Create/update dashboard
- `DashboardGridItemInput` - Add graph to dashboard
- `DashboardFilterInput` - Save dashboard filters

### Enums
- `ChartType` - 'BAR' | 'LINE' | 'PIE' | etc.
- `NumberFormat` - 'currency' | 'percentage' | etc.
- `SortOrder` - 'asc' | 'desc'
- `LegendPosition` - 'top' | 'bottom' | 'none'
- `LayoutType` - 'grid' | 'list'

## Important Notes

- **Don't edit** `backend-graphql.ts` manually - it will be overwritten
- **Always sync** after backend schema changes
- **Commit both** backend and frontend type files
- Frontend and backend stay in sync automatically!
