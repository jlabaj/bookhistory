import 'reflect-metadata';

export const P = <T>(property: (object: T) => void): string | undefined => {
  const chaine = property.toString();
  return RegExp(/\.(.*)/).exec(chaine)?.[1];
};

export const nameKey = Symbol('name');

export function name(className: string): ClassDecorator {
  return Reflect.metadata(nameKey, className);
}

export function getClassName(type: any): string {
  return Reflect.getMetadata(nameKey, type) ?? type.constructor.name;
}
