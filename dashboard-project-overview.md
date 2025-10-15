# Dashboard Project Overview

## Goal
Build a dashboard that visualizes data from a Cube semantic layer using Mantine graphs, allowing users to dynamically construct queries through a UI.

## Project Context
This is a component being developed for a larger project. We're building it as a standalone component to increase development speed, with the intention that everything will be copied and pasted into the larger project later.

## Core Flow
1. User adds a graph to dashboard
2. Selects a model from Cube (dropdown)
3. Chooses dimensions and measures (multiple allowed)
4. System generates GraphQL query to Cube
5. Data visualizes in Mantine graph (line/bar charts initially)

## Tech Stack
- React + TypeScript
- GraphQL (queries to Cube semantic layer)
- REST (Cube metadata API for models/dimensions/measures)
- Postgres (underlying data store)
- Mantine (UI + Charts)
- Cube (semantic layer)

## Key Technical Points
- Cube metadata fetched via REST endpoints
- Data queries use Cube's GraphQL API
- Multiple dimensions/measures per graph supported
- GraphQL chosen for better AI copilot integration later

## Architecture Notes
- Dashboard calls Cube semantic layer directly
- Metadata discovery (models, dimensions, measures) via REST
- Data fetching via GraphQL

## Current Implementation Status

### Chart Visualization System (In Progress)
**Location:** `src/components/CreateGraph.tsx` and `src/components/charts/`

**What Works:**
- Model selection, field selection (measures/dimensions/dates), GraphQL query generation
- 6 chart types: Number tile, line, bar (grouped/stacked, vertical/horizontal)
- Data analysis system (`chartDataAnalyzer.ts`) determines compatible charts from Cube responses
- Auto-filtering to top 15 dimension values to prevent performance issues
- Multi-series support with 15-color palette (`chartColors.ts`)
- Stacked bars with proper data pivoting (converts dimensions to columns)
- Custom tooltips showing totals for stacked charts
- Chart settings panel (title, format, precision, color)

**Key Technical Details:**
- Mantine Charts requires both `@mantine/core/styles.css` AND `@mantine/charts/styles.css`
- Chart sizing: Wrap in `<div style={{ width: '100%', height: 500 }}>`, set `h={500}` on chart
- `withBarValueLabel` requires `valueFormatter` prop to display
- Custom tooltips via `tooltipProps={{ content: CustomComponent }}`
- Stacked charts need data pivoting: primary dimension → x-axis, secondary dimension values → series columns
- Top-15 filtering applies to each dimension independently before pivoting

**Component Structure:**
- `CreateGraph.tsx` - Main orchestrator, query builder (3-column Grid layout)
- `GraphBuilder.tsx` - Chart display container (center column)
- `ChartRenderer.tsx` - Switches between chart types
- `MantineBarChart.tsx` / `MantineLineChart.tsx` - Chart implementations
- `ChartSettingsPanel.tsx` - Right sidebar for configuration
- `FieldSelectionAccordion.tsx` - Left sidebar for field selection
- Helper components: `ModelSelectionSearchBar`, `QueryValidationResults`, `NumberTile`, `SeriesLimitWrapper`

**Known Limitations:**
- No way to show only totals as labels on stacked bars (Mantine Charts API limitation)
- Legend overflow with 15+ series (mitigated with 100px height allocation)
- Grouped bars show individual labels, stacked bars rely on tooltip for totals