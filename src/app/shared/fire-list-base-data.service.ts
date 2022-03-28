import { HttpClient } from '@angular/common/http';
import {
  AngularFireDatabase,
  AngularFireList,
  SnapshotAction,
} from '@angular/fire/compat/database';
import { from, Observable } from 'rxjs';
import { EntityBase } from './base-entities.model';

export class FireListBaseDataService<T extends EntityBase> {
  private _entityRef!: AngularFireList<T>;
  public get entityRef(): AngularFireList<T> {
    return this._entityRef;
  }

  constructor(
    entityTypeName: string,
    private db: AngularFireDatabase,
    private http: HttpClient
  ) {
    this._entityRef = db.list(`/${entityTypeName}`);
  }

  getSnapshotChanges(): Observable<SnapshotAction<T>[]> {
    return this._entityRef.snapshotChanges();
  }

  getAllValueChanges(): Observable<T[]> {
    return this._entityRef.valueChanges();
  }

  add(entity: T): Observable<T> {
    return from(this._entityRef.push(entity)) as unknown as Observable<T>;
  }

  update(key: string, entity: T): Observable<T> {
    return from(
      this._entityRef.update(key, entity)
    ) as unknown as Observable<T>;
  }

  delete(key: string): Observable<T> {
    return from(this._entityRef.remove(key)) as unknown as Observable<T>;
  }

  deleteAll(): Observable<T> {
    return from(this._entityRef.remove()) as unknown as Observable<T>;
  }

  getAllFromFile(filePath: string): Observable<T[]> {
    return this.http.get<any>(filePath);
  }
}
