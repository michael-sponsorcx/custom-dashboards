import { typedQuery } from '../../db/connection';
import type { FeatureFlagRow, FeatureFlag } from './types';
import { featureFlagToCamelCase } from './mapper';

export const findFeatureFlagByKey = async (key: string): Promise<FeatureFlag | null> => {
    const result = await typedQuery<FeatureFlagRow>(
        'SELECT * FROM feature_flags WHERE key = $1 AND archived = false',
        [key]
    );
    return result.rows[0] ? featureFlagToCamelCase(result.rows[0]) : null;
};
