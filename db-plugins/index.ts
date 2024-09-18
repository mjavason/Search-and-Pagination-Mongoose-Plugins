import { search } from './search';
import { pagination } from './paginate';
import { Schema } from 'mongoose';

export function paginatePlugin(schema: Schema) {
  schema.statics.paginate = pagination;
}

export function searchPlugin(schema: Schema) {
  schema.statics.search = search;
}
