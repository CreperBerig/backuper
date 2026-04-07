import { DatabaseType } from "../models/enums/databaseesTypes";

export const DatabaseTypeLabels: Record<DatabaseType, string> = {
  [DatabaseType.PostgresSQL]: "PostgreSQL",
  [DatabaseType.MySQL]: "MySQL",
  [DatabaseType.MSSQL]: "MSSQL",
  [DatabaseType.SQLite]: "SQLite",
}