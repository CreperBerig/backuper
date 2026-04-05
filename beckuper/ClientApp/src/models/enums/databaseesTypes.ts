export const DatabaseType = {
  PostgresSQL: 0,
  MySQL: 1,
  MSSQL: 2,
  SQLite: 3,
} as const;

export type DatabaseType = typeof DatabaseType[keyof typeof DatabaseType];