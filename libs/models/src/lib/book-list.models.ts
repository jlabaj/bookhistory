
import { name } from '@bookhistory/tools';
import { EntityBase } from './base-entities.model';

@name('Book')
export class Book extends EntityBase {
  isbn?: string;
  title?: string;
  genre?: string;
  description?: string;
  publishedDate?: string;
  authors?: string[];
}
