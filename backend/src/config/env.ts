import dotenv from 'dotenv';

export type NodeEnv = 'development' | 'test' | 'production';

export interface HttpEnv {
  nodeEnv: NodeEnv;
  port: number;
  corsOrigin: string;
}

export interface DatabaseEnv {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
  connectionLimit: number;
}

export interface AppEnv extends HttpEnv {
  db: DatabaseEnv;
}

let dotenvLoaded = false;

function ensureDotenv(): void {
  if (!dotenvLoaded) {
    dotenv.config();
    dotenvLoaded = true;
  }
}

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function requiredPresent(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function requiredPort(name: string): number {
  const raw = required(name);
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`${name} must be an integer between 1 and 65535`);
  }
  return parsed;
}

function requiredPositiveInt(name: string): number {
  const raw = required(name);
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

function parseNodeEnv(value: string | undefined): NodeEnv {
  const nodeEnv = value ?? 'development';
  if (nodeEnv !== 'development' && nodeEnv !== 'test' && nodeEnv !== 'production') {
    throw new Error('NODE_ENV must be development, test, or production');
  }
  return nodeEnv;
}

export function getHttpEnv(): HttpEnv {
  ensureDotenv();
  return {
    nodeEnv: parseNodeEnv(process.env.NODE_ENV),
    port: requiredPort('PORT'),
    corsOrigin: required('CORS_ORIGIN'),
  };
}

export function getDatabaseEnv(): DatabaseEnv {
  ensureDotenv();
  return {
    host: required('DB_HOST'),
    port: requiredPort('DB_PORT'),
    name: required('DB_NAME'),
    user: required('DB_USER'),
    password: requiredPresent('DB_PASSWORD'),
    connectionLimit: requiredPositiveInt('DB_CONNECTION_LIMIT'),
  };
}

export function loadEnv(): AppEnv {
  return {
    ...getHttpEnv(),
    db: getDatabaseEnv(),
  };
}
