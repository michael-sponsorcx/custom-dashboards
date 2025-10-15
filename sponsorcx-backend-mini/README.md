# SponsorCX Backend Mini

A minimal backend project that mirrors the structure and tooling of the main SponsorCX API. This project is designed for developing and testing new API endpoints, resolvers, and business logic in isolation before integrating them into the main application.

## 🚀 Features

- **Node.js** with TypeScript
- **Express.js** web framework
- **GraphQL** with express-graphql
- **GraphiQL** playground for development
- **In-memory data store** (easily replaceable with database)
- **CORS** configured for frontend integration
- **ESLint + Prettier** for code quality
- **Jest** for testing

## 📁 Project Structure

```
src/
├── resolvers/          # GraphQL resolvers
│   └── sampleItems.ts  # Example CRUD resolvers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and data
│   └── sampleData.ts   # In-memory data store
├── graphqlSchema.ts    # Main GraphQL schema
server.ts               # Express server setup
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   cd sponsorcx-backend-mini
   yarn install
   ```

2. **Create environment file:**
   ```bash
   cp env.example .env
   ```

3. **Start development server:**
   ```bash
   yarn start
   ```
   The API will be available at `http://localhost:8080`

## 📋 Available Scripts

- `yarn start` - Start development server with nodemon
- `yarn build` - Build TypeScript to JavaScript
- `yarn start:prod` - Build and start production server
- `yarn test` - Run tests
- `yarn lint` - Run ESLint
- `yarn lint:quiet` - Run ESLint (quiet mode)

## 🌐 API Endpoints

### REST Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /graphql` - GraphQL endpoint
- `GET /graphql` - GraphiQL playground (development only)

### GraphQL Schema

#### Queries

```graphql
# Get paginated list of sample items
sampleItems(
  pagination: PaginationInput
  category: String
  status: Status
): SampleItemsResponse!

# Get single sample item by ID
sampleItem(id: ID!): SampleItem
```

#### Mutations

```graphql
# Create new sample item
createSampleItem(input: CreateSampleItemInput!): SampleItem!

# Update existing sample item
updateSampleItem(input: UpdateSampleItemInput!): SampleItem

# Delete sample item
deleteSampleItem(id: ID!): Boolean!
```

#### Types

```graphql
type SampleItem {
  id: ID!
  name: String!
  category: String!
  status: Status!
  value: Float!
  createdAt: String!
  updatedAt: String
}

enum Status {
  ACTIVE
  INACTIVE
  PENDING
}

type SampleItemsResponse {
  items: [SampleItem!]!
  total: Int!
  page: Int!
  limit: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
```

## 🎯 Example Usage

### GraphiQL Playground

Visit `http://localhost:8080/graphql` in development to use the GraphiQL playground.

### Sample Queries

**Get all items:**
```graphql
query {
  sampleItems {
    items {
      id
      name
      category
      status
      value
      createdAt
    }
    total
    hasNextPage
  }
}
```

**Create new item:**
```graphql
mutation {
  createSampleItem(input: {
    name: "New Item"
    category: "Electronics"
    status: ACTIVE
    value: 199.99
  }) {
    id
    name
    status
  }
}
```

**Filter by status:**
```graphql
query {
  sampleItems(status: ACTIVE) {
    items {
      id
      name
      status
    }
  }
}
```

## 🔧 Development Guidelines

### Adding New Resolvers

1. Create resolver file in `src/resolvers/`
2. Define GraphQL types and resolvers
3. Import and add to main schema in `src/graphqlSchema.ts`

Example resolver structure:
```typescript
import { GraphQLObjectType, GraphQLString } from 'graphql';

const MyType = new GraphQLObjectType({
  name: 'MyType',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

export const myQueries = {
  myQuery: {
    type: MyType,
    resolve: () => {
      // Your logic here
    },
  },
};
```

### Data Layer

The project uses an in-memory data store for simplicity. To integrate with a database:

1. Replace functions in `src/utils/sampleData.ts`
2. Add database connection setup
3. Update resolvers to use database queries

### Error Handling

Add proper error handling in resolvers:
```typescript
resolve: async (obj, args) => {
  try {
    // Your logic here
    return result;
  } catch (error) {
    throw new Error(`Failed to process request: ${error.message}`);
  }
}
```

## 🧪 Testing

Run tests with:
```bash
yarn test
```

The project uses Jest for testing. Create test files alongside your resolvers or in a `__tests__` directory.

Example test:
```typescript
import { getSampleItems } from '../utils/sampleData';

describe('Sample Data Utils', () => {
  test('should return sample items', () => {
    const items = getSampleItems();
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveProperty('id');
  });
});
```

## 🔗 Integration with Main API

When ready to integrate into the main SponsorCX API:

1. Copy resolver files to main API's `resolvers/` directory
2. Copy type definitions to main API's `types/` directory
3. Update main GraphQL schema to include new resolvers
4. Replace in-memory data with proper database integration
5. Add proper authentication and authorization

## 📦 Dependencies

### Core Dependencies
- Express 4.17.3
- GraphQL 0.13.2
- express-graphql 0.12.0
- TypeScript 4.9.4
- dotenv 16.4.5

### Development Tools
- Nodemon 2.0.17
- ESLint + TypeScript ESLint
- Prettier
- Jest + ts-jest
- @swc-node/register (for fast TypeScript compilation)

## 🔒 Environment Variables

Create a `.env` file based on `env.example`:

```env
NODE_ENV=development
PORT=8080
CORS_ORIGIN=http://localhost:3000
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new code
3. Write tests for new resolvers and utilities
4. Keep the API simple and focused
5. Document new endpoints and types

## 📝 Notes

- This project is designed to be lightweight and focused
- It mirrors the main SponsorCX API structure for easy integration
- Use this for prototyping new API features before adding to main API
- The in-memory data store is for development only
- Always add proper error handling and validation in production code
