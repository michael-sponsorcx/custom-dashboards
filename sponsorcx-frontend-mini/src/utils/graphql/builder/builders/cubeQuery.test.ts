import { describe, it, expect } from 'vitest';
import { buildCubeQuery, buildSimpleCubeQuery } from './cubeQuery';
import type { QueryBuilderParams } from '../../types';

describe('cubeQuery', () => {
  describe('buildCubeQuery', () => {
    it('should build basic query with measures only', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('query {');
      expect(query).toContain('cube');
      expect(query).toContain('orders');
      expect(query).toContain('count');
      expect(query).toContain('}');
    });

    it('should build query with measures and dimensions', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [
          { name: 'Orders.status', type: 'string' },
        ],
        timeDimensions: [],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('count');
      expect(query).toContain('status');
    });

    it('should build query with time dimensions', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [
          { name: 'Orders.createdAt', type: 'time' },
        ],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('createdAt');
      expect(query).toContain('value');
    });

    it('should include limit parameter', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [],
        limit: 100,
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('limit: 100');
    });

    it('should include timezone parameter', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [],
        timezone: 'America/Los_Angeles',
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('timezone');
      expect(query).toContain('America/Los_Angeles');
    });

    it('should include orderBy parameter', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [],
        orderBy: [
          { field: 'Orders.count', direction: 'desc' },
        ],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('orderBy');
    });

    it('should include filters in where clause', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [],
        filters: [
          {
            fieldType: 'measure', fieldTitle: 'Count',
            fieldName: 'Orders.count',
            operator: '>',
            value: 10,
          },
        ],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('where');
    });

    it('should lowercase cube name in query', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('orders {');
      expect(query).not.toContain('Orders {');
    });

    it('should handle complex query with all parameters', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
          { name: 'Orders.totalRevenue', type: 'number' },
        ],
        dimensions: [
          { name: 'Orders.status', type: 'string' },
          { name: 'Orders.category', type: 'string' },
        ],
        timeDimensions: [
          { name: 'Orders.createdAt', type: 'time' },
        ],
        limit: 50,
        timezone: 'UTC',
        orderBy: [
          { field: 'Orders.count', direction: 'desc' },
        ],
        filters: [
          {
            fieldType: 'dimension', fieldTitle: 'Dimension',
            fieldName: 'Orders.status',
            mode: 'include',
            values: ['shipped'],
          },
        ],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('query {');
      expect(query).toContain('cube');
      expect(query).toContain('count');
      expect(query).toContain('totalRevenue');
      expect(query).toContain('status');
      expect(query).toContain('category');
      expect(query).toContain('createdAt');
      expect(query).toContain('limit: 50');
      expect(query).toContain('UTC');
    });

    it('should properly format query structure', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [],
      };

      const query = buildCubeQuery(params);

      // Check proper nesting
      expect(query).toMatch(/query\s+\{/);
      expect(query).toMatch(/cube.*\{/);
      expect(query).toMatch(/orders.*\{/);
      expect(query).toMatch(/count/);
      expect(query).toMatch(/\}/);
    });

    it('should handle empty dimensions and timeDimensions', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('count');
      expect(query).not.toContain('undefined');
    });

    it('should handle multiple measures', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
          { name: 'Orders.sum', type: 'number' },
          { name: 'Orders.avg', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('count');
      expect(query).toContain('sum');
      expect(query).toContain('avg');
    });

    it('should handle multiple dimensions', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [
          { name: 'Orders.status', type: 'string' },
          { name: 'Orders.category', type: 'string' },
          { name: 'Orders.region', type: 'string' },
        ],
        timeDimensions: [],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('status');
      expect(query).toContain('category');
      expect(query).toContain('region');
    });

    it('should handle multiple time dimensions', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [
          { name: 'Orders.createdAt', type: 'time' },
          { name: 'Orders.updatedAt', type: 'time' },
        ],
      };

      const query = buildCubeQuery(params);

      expect(query).toContain('createdAt');
      expect(query).toContain('updatedAt');
    });
  });

  describe('buildSimpleCubeQuery', () => {
    it('should be an alias for buildCubeQuery', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [],
        timeDimensions: [],
      };

      const query1 = buildCubeQuery(params);
      const query2 = buildSimpleCubeQuery(params);

      expect(query1).toBe(query2);
    });

    it('should work with all parameters', () => {
      const params: QueryBuilderParams = {
        cubeName: 'Orders',
        measures: [
          { name: 'Orders.count', type: 'number' },
        ],
        dimensions: [
          { name: 'Orders.status', type: 'string' },
        ],
        timeDimensions: [],
        limit: 10,
      };

      const query = buildSimpleCubeQuery(params);

      expect(query).toContain('query {');
      expect(query).toContain('count');
      expect(query).toContain('status');
      expect(query).toContain('limit: 10');
    });
  });
});
