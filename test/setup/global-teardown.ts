import { PostgresContainer } from '../utils/postgres-container.js';

export async function teardown() {
  console.log('🚀 Global Teardown: Stopping...');
  await PostgresContainer.stop();
}

export default teardown;
