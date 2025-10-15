# SponsorCX Frontend Mini

A minimal frontend project that mirrors the structure and tooling of the main SponsorCX application. This project is designed for developing and testing new components in isolation before integrating them into the main application.

## 🚀 Features

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Mantine UI** component library (same as main app)
- **TanStack React Table** for data grids
- **Zustand** for state management
- **Apollo Client** for GraphQL integration with backend
- **Vitest** for testing
- **ESLint + Prettier** for code quality

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── DataGrid/       # Example data grid component with Apollo integration
├── graphql/            # GraphQL queries and mutations
├── hooks/              # Custom React hooks (including Apollo hooks)
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
├── tests/              # Test setup and utilities
├── apollo.ts           # Apollo Client configuration
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   cd sponsorcx-frontend-mini
   yarn install
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` to set `VITE_API_URL` if your backend runs on a different port.

3. **Start development server:**
   ```bash
   yarn start
   ```
   The app will be available at `http://localhost:3000`

**Note:** Make sure the backend mini project is running on `http://localhost:8080` for the GraphQL integration to work.

## 📋 Available Scripts

- `yarn start` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn test` - Run tests
- `yarn lint` - Run ESLint
- `yarn prettier:check` - Check code formatting
- `yarn prettier:fix` - Fix code formatting

## 🎯 Example Components

### DataGrid Component

The project includes a fully functional data grid component that demonstrates real GraphQL integration:

- **Apollo Client Integration**: Fetches data from the backend GraphQL API
- **Server-side Pagination**: Handles large datasets efficiently
- **Real-time Filtering**: Filter by status with server-side processing
- **Loading & Error States**: Proper UX for async operations
- **TanStack React Table**: Advanced sorting and filtering capabilities
- **Mantine UI**: Consistent styling with status badges and responsive design

**Usage:**
```tsx
import { DataGrid } from '@/components/DataGrid/DataGrid';

function MyPage() {
  return <DataGrid />; // Automatically connects to GraphQL backend
}
```

**GraphQL Integration:**
```tsx
// Custom hook for data fetching
const { items, loading, error } = useSampleItems({
  pagination: { page: 1, limit: 10 },
  status: 'active'
});
```

## 🔧 Development Guidelines

### Adding New Components

1. Create component directory in `src/components/`
2. Follow the existing structure with TypeScript
3. Include proper type definitions
4. Add tests if needed

### State Management

Use Zustand for state management:

```tsx
import { create } from 'zustand';

interface MyStore {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Styling

Use Mantine components and utilities for consistent styling:

```tsx
import { Button, Container, Title } from '@mantine/core';

function MyComponent() {
  return (
    <Container>
      <Title order={2}>My Component</Title>
      <Button variant="filled">Click me</Button>
    </Container>
  );
}
```

## 🔗 Integration with Main App

When ready to integrate components into the main SponsorCX application:

1. Copy component files to the main app's `src/` directory
2. Update import paths as needed
3. Ensure dependencies are available in the main app
4. Test thoroughly in the main app context

## 🧪 Testing

Run tests with:
```bash
yarn test
```

The project uses Vitest with React Testing Library. Test files should be placed alongside components or in the `src/tests/` directory.

## 📦 Dependencies

### Core Dependencies
- React 18.2.0
- TypeScript 5.8.2
- Vite 6.0.7
- Mantine 8.0.0
- TanStack React Table 8.20.6

### Development Tools
- ESLint + TypeScript ESLint
- Prettier
- Vitest + jsdom
- React Testing Library

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new code
3. Test components thoroughly
4. Keep dependencies minimal and aligned with main app

## 📝 Notes

- This project is designed to be lightweight and focused
- It mirrors the main SponsorCX app structure for easy integration
- Use this for prototyping new features before adding to main app
- Keep the codebase clean and well-documented
