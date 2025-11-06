# Generated GraphQL Types

This directory contains auto-generated TypeScript types from the GraphQL schema.

## What is this?

The `graphql.ts` file contains TypeScript type definitions that match your GraphQL schema exactly. This provides type safety when working with GraphQL queries and mutations.

## How it works

1. **Schema Source**: The types are generated from [src/graphqlSchema.ts](../graphqlSchema.ts)
2. **Generation**: Run `yarn codegen` to regenerate types whenever the schema changes
3. **Configuration**: See [codegen.ts](../../codegen.ts) for generation settings

## Using the Generated Types

### Basic Usage

```typescript
import { Graph, Dashboard, Query, Mutation } from './generated/graphql';

// Type-safe query result
const graph: Graph = {
  id: '123',
  name: 'My Graph',
  chartType: 'BAR', // ✅ TypeScript validates this
  // ... other fields
};
```

### With Your GraphQL Builder

```typescript
import { Graph, GraphInput } from './generated/graphql';

// Query
const query = `
  query GetGraph($id: ID!) {
    graph(id: $id) {
      id
      name
      chartType
    }
  }
`;

const response = await myGraphQLBuilder(query, { id: '123' });
const graph: Graph = response.data.graph; // ✅ Type-safe

// Mutation
const mutation = `
  mutation CreateGraph($input: GraphInput!) {
    createGraph(input: $input) {
      id
      name
    }
  }
`;

const input: GraphInput = {
  name: 'New Graph',
  viewName: 'my_view',
  chartType: 'BAR',
  chartTitle: 'My Chart',
};

const result = await myGraphQLBuilder(mutation, { input });
```

## Available Types

### Query Types
- `Query` - All available queries
- `Graph`, `Dashboard`, `DashboardGridItem`, `DashboardFilter` - Entity types
- `CubeSchema`, `CubeDimensionValues` - Cube API types

### Mutation Types
- `Mutation` - All available mutations
- Input types: `GraphInput`, `DashboardInput`, `DashboardGridItemInput`, `DashboardFilterInput`

### Enums
- `ChartType` - Chart visualization types (BAR, LINE, PIE, etc.)
- `NumberFormat` - Number formatting options
- `SortOrder` - Sort direction (ASC, DESC)
- `LegendPosition` - Legend placement
- `LayoutType` - Dashboard layout types

## Regenerating Types

Whenever you modify the GraphQL schema, regenerate the types:

```bash
yarn codegen
```

This ensures your TypeScript types always match your GraphQL schema.

## Benefits

✅ **Type Safety**: Catch errors at compile time instead of runtime
✅ **Autocomplete**: Get IntelliSense for all GraphQL fields
✅ **Refactoring**: Rename fields with confidence
✅ **Documentation**: Types serve as inline documentation

## See Also

- [Example Usage](../examples/typedQueryExample.ts) - Complete examples
- [GraphQL Schema](../graphqlSchema.ts) - The source schema
- [Codegen Config](../../codegen.ts) - Generation configuration
