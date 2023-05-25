export abstract class CallableInstance {
  constructor(callback: (...args: any) => any) {
    return this.createCallableInstance(callback);
  }

  private createCallableInstance(callback: (...args: any) => any): this {
    const callableInstance = ((...args: any[]) =>
      callback(...args)) as unknown as this;
    Object.setPrototypeOf(callableInstance, Object.getPrototypeOf(this));
    Object.assign(callableInstance, this);

    return callableInstance;
  }
}
