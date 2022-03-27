import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EntityBase } from './base-entities.model';
import { EntityOp } from './store-entities.model';
export abstract class BaseStore {
  protected readonly _entitySource: BehaviorSubject<EntityBase[]> =
    new BehaviorSubject<EntityBase[]>([]);

  protected ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  protected addActionSource$: Subject<EntityOp> = new Subject<EntityOp>();
  protected updateActionSource$: Subject<EntityOp> = new Subject<EntityOp>();
  protected removeActionSource$: Subject<EntityOp> = new Subject<EntityOp>();

  public readonly entity$ = this._entitySource
    .asObservable()
    .pipe(takeUntil(this.ngUnsubscribe$));

  protected destroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  protected _set(entities: EntityBase[]): void {
    this._entitySource.next(entities);
  }

  public getStore(): EntityBase[] {
    return this._entitySource.getValue();
  }

  protected addToStore(entity: EntityBase): void {
    this.addItemToStore(entity);
    this.addActionSource$.next(EntityOp.ADD);
  }

  protected updateStore<T extends EntityBase>(entity: T): boolean {
    const entityToBeUpdated = this.getStore().filter(
      (e) => e.key === entity.key
    )?.[0];

    let newEntity = entity;
    if (entityToBeUpdated) {
      newEntity = { ...entityToBeUpdated, ...entity };
      if (this.removeFromStore(entityToBeUpdated.key)) {
        this.addItemToStore(newEntity);
        this.updateActionSource$.next(EntityOp.ADD);
        return true;
      }
      return false;
    }
    return false;
  }

  protected removeFromStore(key?: string): boolean {
    if (!key || key === '') return false;
    const entities = this.getStore().filter((e) => e.key !== key);
    if (entities.length > 0 || this.getStore().length == 1) {
      this._set(entities);
      this.removeActionSource$.next(EntityOp.DELETE);
      return true;
    }
    return false;
  }

  private addItemToStore(entity: EntityBase): void {
    const entities = [...this.getStore(), entity];
    this._set(entities);
  }
}
