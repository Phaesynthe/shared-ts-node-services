import { createClient } from 'redis';
import { ServiceBase } from '../services';

export class RedisService extends ServiceBase {
  private client: ReturnType<typeof createClient>;

  private redisHost: string;
  private redisPort: number;
  private redisPassword: string;

  constructor() {
    super();
  }

  public async connect(redisHost: string, redisPort: number, redisPassword: string) {
    this.redisHost = redisHost;
    this.redisPort = redisPort;
    this.redisPassword = redisPassword;

    this.client = createClient({
      legacyMode: false,
      socket: {
        port: this.redisPort,
        host: this.redisHost
      }
    });

    return this.client.connect();
  }

  public async healthcheck() {
    await this.setKey('FOO', 'BAR');
    const getKeyResult = await this.getKey('FOO');

    await this.deleteKey('FOO');

    return getKeyResult === 'BAR';
  }

  public async setKey(key: string, value: string): Promise<string> {
    return await this.client.set(key, value);
  }

  public async getKey(key: string): Promise<string> {
    return await this.client.get(key);
  }

  public async deleteKey(key: string): Promise<number> {
    return await this.client.del(key);
  }

  public async deleteCollection(collectionName: string): Promise<void> {
    console.log(`Redis Service: Deleting Collection: ${collectionName}`);
    await this.client.del(collectionName);
  }

  public async getOneFromCollection(collectionName: string, key: string): Promise<string> {
    return await this.client.hGet(collectionName, key);
  }

  public async deleteOneFromCollection(collectionName: string, key: string): Promise<number> {
    return await this.client.hDel(collectionName, key);
  }

  public async getManyFromCollection(collectionName: string, keys: string[]): Promise<string[]> {
    const fetchActions = [];
    for (const id of keys) {
      fetchActions.push(await this.getOneFromCollection(collectionName, id));
    }
    return await Promise.all(fetchActions);
  }

  public async getCollection(collectionName: string): Promise<string[]> {
    const result = await this.client.hGetAll(collectionName);

    const records: string[] = [];
    for (const [key, value] of Object.entries(result)) {
      records.push(value);
    }

    return records;
  }

  public async setInCollection(collectionName: string, key: string, value: string) {
    return await this.client.hSet(collectionName, key, value);
  }
}
