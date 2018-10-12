import { ZtoStoreModule } from './zto-store.module';

describe('ZtoStoreModule', () => {
  let ztoStoreModule: ZtoStoreModule;

  beforeEach(() => {
    ztoStoreModule = new ZtoStoreModule();
  });

  it('should create an instance', () => {
    expect(ztoStoreModule).toBeTruthy();
  });
});
