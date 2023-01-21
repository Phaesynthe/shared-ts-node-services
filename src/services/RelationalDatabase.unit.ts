import { RelationalDatabaseService } from './RelationalDatabase.service';

import { Pool, PoolConfig } from 'pg';
const connectionMock = {
  query: jest.fn(),
  release: jest.fn()
};
const poolMock = {
  close: jest.fn(),
  connect: jest.fn().mockImplementation(() => connectionMock),
};
jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => poolMock),
    PoolConfig: {}
  };
});

describe('Relational Database Service', () => {
  const poolMock = Pool as unknown as jest.Mock;

  it('can be instantiated', () => {
    const rdbService = RelationalDatabaseService.instance();
    expect(rdbService).toBeDefined();
    expect(poolMock.mock.calls.length).toEqual(1);
  });

  describe('healthcheck()', () => {
    it('exists', () => {
      const rdbService = RelationalDatabaseService.instance();
      expect(rdbService.healthcheck).toBeDefined();
      expect(typeof rdbService.healthcheck).toEqual('function');
    });

    it('provides a healthcheck result', async () => {
      connectionMock.query.mockImplementationOnce((statement: string) => {
        return { rows: [ { time: 'fake time' } ] };
      });
      const result = await RelationalDatabaseService.instance().healthcheck();
      expect(connectionMock.query).toBeCalledTimes(1);
      expect(connectionMock.release).toBeCalledTimes(1);
      expect(result.ok).toBeDefined();
      expect(result.ok).toEqual(true);
      expect(result.remoteTime).toBeDefined();
      expect(result.remoteTime).toEqual('fake time');
    });
  });

  describe('query()', () => {
    it('exists', () => {
      const rdbService = RelationalDatabaseService.instance();
      expect(rdbService.query).toBeDefined();
      expect(typeof rdbService.query).toEqual('function');
    });
  });

  it('shutdown()', async () => {
    expect(RelationalDatabaseService.instance().shutdown).toBeDefined();
    expect(typeof RelationalDatabaseService.instance().shutdown).toEqual('function');
  });
});
