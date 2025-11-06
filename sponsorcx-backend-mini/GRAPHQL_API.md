# GraphQL API Documentation

Once the database is set up and the server is running, you can use GraphiQL at:
**http://localhost:8080/graphql**

## Available Queries

### Graphs

```graphql
# Get all graphs
query {
  graphs {
    id
    name
    chartType
    chartTitle
    viewName
  }
}

# Get a single graph
query {
  graph(id: 123) {
    id
    name
    # ... all fields
  }
}
```

### Dashboards

```graphql
# Get all dashboards
query {
  dashboards {
    id
    name
    layout
  }
}

# Get dashboard grid items with graph details
query {
  dashboardGridItems(dashboardId: 123) {
    id
    graphId
    gridColumn
    gridRow
    gridWidth
    gridHeight
    graph {
      name
      chartType
    }
  }
}

# Get dashboard filters
query {
  dashboardFilter(dashboardId: 123) {
    selectedViews
    availableFields
    activeFilters
  }
}
```

## Available Mutations

### Graphs

```graphql
# Create a graph
mutation {
  createGraph(
    input: {
      name: "My Graph"
      viewName: "sales_view"
      chartType: BAR
      chartTitle: "Sales by Region"
      measures: ["total_sales"]
      dimensions: ["region"]
    }
  ) {
    id
    name
  }
}

# Update a graph
mutation {
  updateGraph(
    id: 123
    input: { name: "Updated Name" }
  ) {
    id
    name
  }
}

# Delete a graph
mutation {
  deleteGraph(id: 123) {
    id
  }
}
```

### Dashboards

```graphql
# Create a dashboard
mutation {
  createDashboard(
    input: {
      name: "My Dashboard"
      layout: GRID
    }
  ) {
    id
    name
  }
}

# Add a graph to a dashboard with grid positioning
mutation {
  addDashboardGridItem(
    dashboardId: 123
    input: {
      graphId: 456
      gridColumn: 1
      gridRow: 1
      gridWidth: 6
      gridHeight: 4
    }
  ) {
    id
  }
}

# Save dashboard filters
mutation {
  saveDashboardFilter(
    dashboardId: 123
    input: {
      selectedViews: ["view1", "view2"]
      availableFields: [...]
      activeFilters: [...]
    }
  ) {
    id
  }
}
```