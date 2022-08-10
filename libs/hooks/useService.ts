interface CanBeInstantiated<T> {
  new (): T;
}

const container = new Map();

export default function useService<T>(serviceType: CanBeInstantiated<T>): T {
  let service = container.get(serviceType);

  if (!service) {
    service = new serviceType();
    container.set(serviceType, service);
  }

  return service as T;
}
