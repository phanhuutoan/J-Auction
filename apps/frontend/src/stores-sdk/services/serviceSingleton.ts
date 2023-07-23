export type IParameterClass<T> = { new (...args: any[]): T };

const serviceRegistry = new Map<string, any>();

export function registerService<T>(ServiceClass: IParameterClass<T>) {
  console.log("REGISTER");
  if (!serviceRegistry.has(ServiceClass.name)) {
    const service = new ServiceClass();
    serviceRegistry.set(ServiceClass.name, service);
  }
}

export function getService<T>(ServiceClass: IParameterClass<T>) {
  const service = serviceRegistry.get(ServiceClass.name);

  if (!service) {
    throw new Error(`Service ${ServiceClass.name} is not registered!`);
  }

  return service as T;
}
