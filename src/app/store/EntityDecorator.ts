import isEmpty from 'lodash-es/isEmpty';
import { META_DESIGN_PARAMTYPES, META_STORE_NSFACTORY, reflect } from './util';
import { StoreService } from './store.service';

export interface Constructor extends Object {
  new(...args: any[]): any;
}

/**
 * 命名空间工厂函数
 */
export type NamespaceFactory = (...args: any[]) => string;
/**
 * Entity装饰器
 */
export type EntityDecorator<T> = (constructor: T) => any;
/**
 * Entity装饰器工厂
 */
export type EntityDecoratorFactory<T extends Constructor = Constructor> = (name: NamespaceFactory | string) => EntityDecorator<T>;

export const Entity: EntityDecoratorFactory = EntityDecoratorFactory;

export function EntityDecoratorFactory(name) {
  if (typeof name !== 'function' && typeof name !== 'string') {
    throw new Error(`name:${typeof name} 只能为string和function类型!`);
  }
  const nsFactory: NamespaceFactory = typeof name === 'function' ? () => name() : () => name;
  return function (EntityClass: Constructor) {
    // 为EntityClass定义namespace factory
    reflect.defineMetadata(META_STORE_NSFACTORY, nsFactory, EntityClass);

    // EntityClass构造函数中不能有参数
    // 这里主要实现对EntityClass实例的代理
    const entityClassDesignParamtypes = reflect.getMetadata(META_DESIGN_PARAMTYPES, EntityClass);
    if (!isEmpty(entityClassDesignParamtypes)) {
      throw Error('Entity 构造器不能有参数!当前实现在Entity中不支持依赖注入!');
    }
    // 这里加一个空的装饰器,用于typescript自动填充meta-data
    // angular需要依赖meta-data来依赖注入,也可以使用@Injectable()
    @Empty()
    class TheEntity extends EntityClass {
      constructor(private store: StoreService) {
        super();
        // 在EntityClass构造器执行后,对当前实例进行代理装饰
        // field
        // action
        // select
      }
    }

    // todo 链接angular的依赖注入系统
    // 需要手动模拟出angular对于构造器解析的所有逻辑,如果angular的逻辑修改了呢??
    return TheEntity;
  };
}

export type FieldDecorator = (...args: any[]) => any;
export type FieldDecoratorFactory = () => FieldDecorator;

export function FieldDecoratorFactory() {
  return function (target, propertyKey) {
    console.log('field', arguments);
  };
}

export const Field: FieldDecoratorFactory = FieldDecoratorFactory;

export type ActionDecorator = (target: any, propertyKey: string) => any;
export type ActionDecoratorFactory = () => ActionDecorator;

export function ActionDecoratorFactory() {
  return function (target, propertyKey) {
    console.log('action', arguments);
  };
}

export const Action: ActionDecoratorFactory = ActionDecoratorFactory;

export type SelectDecorator = (target: any, propertyKey: string) => any;
export type SelectDecoratorFactory = () => SelectDecorator;

export function SelectDecoratorFactory() {
  return function (target, propertyKey) {
    console.log('select', arguments);
  };
}

export const Select: SelectDecoratorFactory = SelectDecoratorFactory;

export function Empty(): any {
  return () => void 0;
}
