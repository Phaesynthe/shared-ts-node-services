import { Pool, PoolConfig } from 'pg';
import {ServiceBase} from "./ServiceBase";
import {timeout} from "../utilities";

export class RelationalDatabaseService extends ServiceBase {
  private connectionPool: Pool;

  // Provides a configured singleton Instance
  // static _instance: RelationalDatabaseService;
  //
  // public static get instance(): RelationalDatabaseService {
  //   const config: PoolConfig = Config.get().dbConfig;
  //   if (!RelationalDatabaseService._instance) {
  //     RelationalDatabaseService._instance = new RelationalDatabaseService();
  //   }
  //
  //   return RelationalDatabaseService._instance;
  // }

  public connect(user: string, host: string, database: string, port: number, password: string) {
    this.connectionPool = new Pool({
      user,
      host,
      database,
      password,
      port
    });
    // await timeout(50);
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

  public static async shutdown() {
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
