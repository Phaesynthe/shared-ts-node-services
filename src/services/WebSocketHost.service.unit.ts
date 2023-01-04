import { WebsocketHostService } from "./";

describe('Web Socket Host Service - Integration', () => {

    describe('set up', () => {
        it('fetches an instance', () => {
            const instance = WebsocketHostService.instance();
            expect(instance).toBeDefined();
            expect(instance.start).toBeDefined();
        });
    });

    describe('client connection', () => {

    });

    describe('feature server connection', () => {

    });
});
