import { Order, WhereOptions, ProjectionAlias } from "sequelize";

export interface IListOptions<T> {
  order?: Order;
  where?: WhereOptions<T>;
  columns?: ((keyof T) | string)[]
  page?: number;
  limit?: number;
}
