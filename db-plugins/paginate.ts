import { FilterQuery, PopulateOptions, Document, Model } from 'mongoose';
import { PaginationOptions } from './interfaces';

export async function pagination<T extends Document>(
  this: Model<T>,
  filter: FilterQuery<T>,
  options: PaginationOptions & { populate?: PopulateOptions } = { limit: 10 }
) {
  const limit = Math.max(options.limit ?? 10, 1); // Default to 10 if undefined
  const page = Math.max(options.page ?? 1, 1);
  const skip = (page - 1) * limit;

  // Use estimatedDocumentCount for performance when there's no filter
  const total = Object.keys(filter).length
    ? await this.countDocuments(filter)
    : await this.estimatedDocumentCount();

  const query = this.find(filter).limit(limit).skip(skip).sort('-createdAt');
  if (options.populate) query.populate(options.populate);

  const data = await query.exec();
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      hasNextPage: page < totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      hasPreviousPage: page > 1,
      totalPages,
      totalCount: total,
    },
  };
}
