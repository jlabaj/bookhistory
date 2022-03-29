import { Injectable, OnDestroy } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { EntityBase } from './base-entities.model';
import { BaseStore } from './base.store';
import { FireListBaseDataService } from './fire-list-base-data.service';
import { EntityOp } from './store-entities.model';

@Injectable()
export class DefaultStore<T extends EntityBase>
  extends BaseStore
  implements OnDestroy
{
  public constructor(protected baseDataService: FireListBaseDataService<T>) {
    super();
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  public getAll(): Observable<T[]> {
    this.baseDataService
      .getAllValueChanges()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((entities) => this._set(entities));
    return this.entity$ as Observable<T[]>;
  }

  public getSnapshotChanges() {
    this.baseDataService
      .getSnapshotChanges()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((changes: any) =>
        this._set(
          changes.map((c: any) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );
    return this.entity$ as Observable<T[]>;
  }

  public add(entity: T): Observable<EntityOp> {
    this.baseDataService
      .add(entity)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((e: any) => this.addToStore(e));
    return this.addActionSource$;
  }

  public update(key: string, entity: T): Observable<EntityOp> {
    this.baseDataService
      .update(key, entity)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.updateStore(entity));
    return this.updateActionSource$;
  }

  public delete(key: string): Observable<EntityOp> {
    this.baseDataService
      .delete(key)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.removeFromStore(key));
    return this.removeActionSource$;
  }

  public deleteMultiple(keys: string[]): Observable<EntityOp> {
    this.baseDataService
      .deleteMultiple(keys)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.removeMultipleFromStore(keys));
    return this.removeActionSource$;
  }
}
