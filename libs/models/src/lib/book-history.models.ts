
import { name } from '@bookhistory/tools';
import { EntityBase } from './base-entities.model';

@name('BookHistory')
export class BookHistory extends EntityBase {
  bookId?: string;
  isbn?: string;
  timeOfChange?: string;
  change?: string;
}
