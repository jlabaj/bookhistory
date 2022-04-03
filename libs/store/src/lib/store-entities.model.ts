export interface IAction {
  entityName?: string;
  op: EntityOp;
}

export enum EntityOp {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
