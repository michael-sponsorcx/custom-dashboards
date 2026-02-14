/**
 * Graph API
 *
 * CRUD operations for graphs.
 */

export {
  fetchGraphs,
  fetchGraph,
} from './queries';

export {
  createGraph,
  updateGraph,
  deleteGraph,
} from './mutations';

export { toGraphInput } from './mappers';
