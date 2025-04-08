export interface IDatabaseConfigAttributes {
  type: string;
  username: string;
  password: string;
  database: string;
  host: string;
  port: number | string;
}

export const databaseConfig: IDatabaseConfigAttributes = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};
