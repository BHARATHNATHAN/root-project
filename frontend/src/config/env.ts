interface FrontendEnv {
  apiBaseUrl: string;
}

function readApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_BASE_URL;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('VITE_API_BASE_URL is required');
  }

  return value.trim().replace(/\/$/, '');
}

export const env: FrontendEnv = {
  apiBaseUrl: readApiBaseUrl(),
};
