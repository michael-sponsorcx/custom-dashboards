import { executeBackendGraphQL } from '../../core/client';
import type { FeatureFlag } from '../../../types/backend-graphql';

const FEATURE_FLAG_FIELDS = `
  id
  key
  name
  description
  defaultValue
  archived
  permanent
`;

export const fetchFeatureFlag = async (key: string): Promise<FeatureFlag | null> => {
  const query = `
    query FetchFeatureFlag($key: String!) {
      featureFlag(key: $key) {
        ${FEATURE_FLAG_FIELDS}
      }
    }
  `;

  const response = await executeBackendGraphQL<{ featureFlag: FeatureFlag | null }>(query, { key });
  return response.data?.featureFlag ?? null;
};

export const isFeatureEnabled = async (key: string): Promise<boolean> => {
  const flag = await fetchFeatureFlag(key);
  return flag?.defaultValue ?? false;
};
