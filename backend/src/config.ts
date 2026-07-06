import 'dotenv/config';

interface Config {
  port: number;
  jwtSecret: string;
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
};
