// Native: no server rendering, always return the client value.
export function useClientOnlyValue<S, C>(_server: S, client: C): S | C {
  return client;
}
