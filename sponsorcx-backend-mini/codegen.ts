import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';
import { printSchema } from 'graphql';
import { graphqlSchema } from './src/graphqlSchema';

const config: CodegenConfig = {
    schema: printSchema(graphqlSchema),
    generates: {
        './src/generated/graphql.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
            config: {
                useIndexSignature: true,
                scalars: {
                    JSON: 'any',
                },
            },
        },
    },
};

export default config;
