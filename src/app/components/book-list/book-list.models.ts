import { EntityBase } from '@bookhistory/shared';
import { name } from '@bookhistory/shared/tools';
@name('Book')
export class Book extends EntityBase {
  isbn?: string;
  title?: string;
  description?: string;
  publishedDate?: string;
  authors?: string[];
}
