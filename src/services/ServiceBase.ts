export class ServiceBase {
    protected static _instance: ServiceBase;
    public static instance<T>(this: new () => T): T {
        return this.prototype._instance ?? (this.prototype._instance = new this());
    }
}
