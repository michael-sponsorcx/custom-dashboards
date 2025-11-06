# SponsorCX Backend - Database Setup Guide

This guide will help you set up the PostgreSQL database and configure the backend to replace localStorage with GraphQL endpoints.

## Database Setup

### 1. PostgreSQL Configuration

Your PostgreSQL instance should be running on **port 5432**.

### 2. Environment Variables

Copy the [.env.example](.env.example) file to `.env` and fill in your PostgreSQL credentials:

```bash
cp .env.example .env
```

Then edit the `.env` file with your database credentials:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sponsorcx
DB_USER=sponsorcx_user
DB_PASSWORD=your_db_password
DB_SSL=false
```

### 3. Run Migrations

Once you've configured the `.env` file, run the database migrations:

```bash
cd /Users/michael/dev/SponsorCX-front-back-min/sponsorcx-backend-mini
yarn migrate
```

This will:
- Create the `migrations` tracking table
- Create the following tables:
  - `graphs` - Saved graph/chart configurations (replaces `sponsorcx_saved_graphs` in localStorage)
  - `dashboards` - Dashboard metadata (one per organization, replaces `sponsorcx_dashboard` in localStorage)
  - `dashboard_grid_items` - Graph positions on dashboards for grid layout (replaces `sponsorcx_dashboard_items` in localStorage)
  - `dashboard_filters` - Dashboard-wide filters (replaces `sponsorcx_dashboard_filters` in localStorage)

**Note:** This migration assumes the `organizations` table already exists in your database.

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────┐
│   organizations     │
│─────────────────────│
│ id (PK)             │
│ name                │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           ├─────────────────────────────────┐
           │                                 │
           │ 1:1                             │ 1:N
           │                                 │
           ▼                                 ▼
┌─────────────────────┐           ┌─────────────────────┐
│    dashboards       │           │      graphs         │
│─────────────────────│           │─────────────────────│
│ id (PK)             │           │ id (PK)             │
│ organization_id (FK)│           │ organization_id (FK)│
│ name                │           │ name                │
│ layout              │           │ view_name           │
│ created_at          │           │ chart_type          │
│ updated_at          │           │ chart_title         │
└──────────┬──────────┘           │ measures            │
           │                      │ dimensions          │
           │ 1:N                  │ ...                 │
           │                      └──────────▲──────────┘
           ▼                                 │
┌─────────────────────┐                     │
│dashboard_grid_items │                     │
│─────────────────────│                     │
│ id (PK)             │                     │
│ dashboard_id (FK)───┘                     │
│ graph_id (FK)─────────────────────────────┘
│ grid_column         │
│ grid_row            │
│ grid_width          │
│ grid_height         │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐
│  dashboard_filters  │
│─────────────────────│
│ id (PK)             │
│ dashboard_id (FK)───┐
│ selected_views      │ 1:1
│ available_fields    │
│ active_filters      │
│ created_at          │
│ updated_at          │
└─────────────────────┘
           │
           └───────────────────────────────┐
                                           │
                                           ▼
                            ┌─────────────────────┐
                            │    dashboards       │
                            └─────────────────────┘

Relationships:
• One organization has ONE dashboard (1:1)
• One organization has MANY graphs (1:N)
• One dashboard has MANY dashboard grid items (1:N)
• One dashboard has ONE dashboard filter (1:1)
• One graph can be in MANY dashboards via dashboard_grid_items (N:M)
```

### Tables

#### organizations
- `id` (BIGINT, Primary Key)
- `name` (VARCHAR)
- `created_at`, `updated_at`
- **Note:** This table already exists in your database

#### graphs
- `id` (BIGINT, Primary Key, auto-increment)
- `organization_id` (BIGINT, Foreign Key → organizations.id)
- `name`, `view_name`, `chart_type`, `chart_title` (VARCHAR)
- `measures`, `dimensions`, `dates` (TEXT[])
- `filters`, `available_fields`, `active_filters` (JSONB)
- Chart configuration: `number_format`, `number_precision`, `color_palette`, etc.
- Grid/axis configuration: `show_grid_lines`, `show_regression_line`, axis labels
- KPI fields: `kpi_value`, `kpi_label`, `kpi_show_trend`, etc.
- `created_at`, `updated_at`

#### dashboards
- `id` (BIGINT, Primary Key, auto-increment)
- `organization_id` (BIGINT, Foreign Key → organizations.id, UNIQUE)
- `name` (VARCHAR)
- `layout` (VARCHAR: 'grid' or 'list')
- `created_at`, `updated_at`
- **One dashboard per organization** (enforced by UNIQUE constraint)

#### dashboard_grid_items
- `id` (BIGINT, Primary Key, auto-increment)
- `dashboard_id` (BIGINT, Foreign Key → dashboards.id)
- `graph_id` (BIGINT, Foreign Key → graphs.id)
- `grid_column`, `grid_row`, `grid_width`, `grid_height` (INTEGER)
- `display_order` (INTEGER)
- `created_at`, `updated_at`
- **UNIQUE constraint:** (dashboard_id, graph_id)
- **Grid layout is stored here**, not on the graph itself, allowing the same graph to have different positions on different dashboards

#### dashboard_filters
- `id` (BIGINT, Primary Key, auto-increment)
- `dashboard_id` (BIGINT, Foreign Key → dashboards.id, UNIQUE)
- `selected_views` (TEXT[])
- `available_fields` (JSONB)
- `active_filters` (JSONB)
- `created_at`, `updated_at`

## GraphQL API

For detailed GraphQL API documentation including queries and mutations, see [GRAPHQL_API.md](GRAPHQL_API.md).

Once the database is set up and the server is running, you can use GraphiQL at:
**http://localhost:8080/graphql**

## Next Steps

1. **Configure your `.env` file** with PostgreSQL credentials
2. **Run the migrations** using `yarn migrate`
3. **Start the backend server** using `yarn start`
4. **Test the GraphQL endpoints** at http://localhost:8080/graphql
5. **Update frontend services** to use GraphQL instead of localStorage
