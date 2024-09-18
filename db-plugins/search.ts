import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { PaginationOptions } from './interfaces';

export async function search<T extends Document>(
  this: any,
  {
    query,
    fields,
    filters = {},
  }: { query: string; fields: string[]; filters?: FilterQuery<unknown> },
  options?: PaginationOptions & { populate?: PopulateOptions }
) {
  const filter = {
    $or: fields.map((field) => ({ [field]: { $regex: query, $options: 'i' } })),
    ...filters,
  };

  return this.paginate(filter, options);
}
