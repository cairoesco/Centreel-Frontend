export const environment = {
  production: true,
  // TODO: inject via build-time env var or proxy config
  baseUrl: (window as any).__env?.API_URL ?? 'https://testingapi.centreel.app/',
  client_id: 2
};
