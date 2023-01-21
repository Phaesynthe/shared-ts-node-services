import { Pool } from 'pg';
import { ServiceBase } from "./ServiceBase";

export class RelationalDatabaseService extends ServiceBase {
  private connectionPool: Pool;

  public connect(user: string, host: string, database: string, port: number, password: string) {
    this.connectionPool = new Pool({
      user,
      host,
      database,
      password,
      port
    });
  }

  public async healthcheck() {
    let result;
    try {
      result = await this.query('SELECT now() as time;');
    } catch (error) {
      console.error(`Unexpected error: ${error}`);
      throw error;
    }

    return { ok: true, remoteTime: result[0].time };
  }

  public async query(statement): Promise<any[]> {
    let result;
    let client;

    try {
      client = await this.connectionPool.connect();

      result = await client.query(statement);
    } catch (err) {
      if (/^duplicate key value violates unique constraint/.test(err.message)) {
        throw new Error('Duplicate Record Conflict');
      } else if (/^Error: No record:/.test(err.message)) {
        throw err;
      } else if (err.message === 'Cannot read properties of undefined (reading \'release\')') {
        throw new Error('Connection not initialized');
      } else {
        console.log(statement);
        console.error(`Unexpected SQL query error: ${err.message}`);
        throw new Error('Unknown Error');
      }
    } finally {
      client.release();
    }

    return result.rows;
  }

  public async shutdown() {
    if (RelationalDatabaseService._instance) {
      await RelationalDatabaseService.instance().connectionPool.end();
      RelationalDatabaseService._instance = undefined;
    }
  }
}

export interface IPostgresPreparedStatement {
  name?: string;
  text: string;
  values?: any[];
}
