/**
 * Cron Job Result Resolvers
 * GraphQL resolvers for querying cron job execution history
 */

import { GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import { CronJobResultType } from '../types';
import { findCronJobResultsByCronJobId } from '../../models/cronJobResult';

// ============================================================================
// Queries
// ============================================================================

export const cronJobResultQueries = {
    /**
     * Fetch cron job results by cron job ID
     */
    cronJobResultsByCronJobId: {
        type: new GraphQLList(CronJobResultType),
        args: {
            cronJobId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_: unknown, args: { cronJobId: string }) =>
            findCronJobResultsByCronJobId(args.cronJobId),
    },
};
