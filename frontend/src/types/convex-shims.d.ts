declare module "@convex-api" {
  export const api: any;
}

declare module "@convex-data" {
  export type Id<TableName extends string> = string & { __tableName?: TableName };
}
