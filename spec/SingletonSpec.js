import Singleton from '../Singleton';

class A extends Singleton {
  constructor(...args) {
    super(...args);
    this.b = 1;
  }
}

describe('Singleton', () => {
  it('should always have the same instance ', () => {
    expect(A.instance).toEqual(A.instance);
  });

  it('should have the same instance as a new instance', () => {
    expect(A.instance).toEqual(new A);
  });

  it('should always give back the same new instance', () => {
    expect(new A).toEqual(new A);
  });

  it('should preserve property values', () => {
    const a = A.instance;
    a.b = 2;
    expect(a.b).toEqual(A.instance.b);
  });
});
