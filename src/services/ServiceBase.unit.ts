import { ServiceBase } from "./ServiceBase";

class TestExample extends ServiceBase {
    public memberField: string;
    constructor() {
        super();
        this.memberField = 'a value';
    }
}

describe('Service Base - Unit', () => {
    it('Provides and instance of a derived class', () => {
        const instance = TestExample.instance();
        expect(instance).toBeDefined();
        expect(instance.memberField).toBeDefined();
        expect(instance.memberField).toEqual('a value');
    });
});
