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