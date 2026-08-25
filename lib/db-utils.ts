export const getDbOperators = async () => {
  const drizzleORM = await import("drizzle-orm");
  return {
    eq: drizzleORM.eq,
    and: drizzleORM.and,
    or: drizzleORM.or,
  };
};
