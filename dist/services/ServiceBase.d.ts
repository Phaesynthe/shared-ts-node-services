export declare class ServiceBase {
    protected static _instance: ServiceBase;
    static instance<T>(this: new () => T): T;
}
