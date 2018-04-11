import isEmpty from 'lodash-es/isEmpty';
import isFunction from 'lodash-es/isFunction';
import isString from 'lodash-es/isString';
import isArray from 'lodash-es/isArray';
import isUndefined from 'lodash-es/isUndefined';
import {invariant, META_DESIGN_PARAMTYPES, META_STORE_ACTION, META_STORE_NSFACTORY, META_STORE_SELECT, reflect} from './util';
import {StoreService} from './store.service';
import {State} from './types';

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
  invariant(isFunction(name) || isString(name), `name:${name},type:${typeof name} 只能为string和function类型!`);

  const nsFactory: NamespaceFactory = isFunction(name) ? () => name() : () => name;

  return function (EntityClass: Constructor) {

    invariant(isFunction(EntityClass), `Entity:${EntityClass} 必须为函数!`);
    // @Entity装饰器不支持,因为@Entity需要对EntityClass进行 代理/装饰
    // 对EntityClass contructor执行后的实例对象进行再修饰
    const nsf = reflect.getMetadata(META_STORE_NSFACTORY, EntityClass.prototype);
    invariant(isUndefined(nsf), `@Entity EntityClass:${EntityClass} 存在被@Entity装饰的父类!`);

    // 为EntityClass定义namespace factory 注意元数据定义在原型对象上
    reflect.defineMetadata(META_STORE_NSFACTORY, nsFactory, EntityClass.prototype);

    // 从元数据中获取EntityClass构造函数中参数
    const entityClassDesignParamtypes = reflect.getOwnMetadata(META_DESIGN_PARAMTYPES, EntityClass);

    invariant(isEmpty(entityClassDesignParamtypes), 'Entity 构造器不能有参数!当前实现在Entity中不支持依赖注入!');

    // 通过继承EntityClass来实现 装饰/代理
    // 需用Decorator装饰TheEntity,用于typescript自动填充meta-data
    // angular需要依赖meta-data来依赖注入,也可以使用@Injectable()
    @Empty()
    class TheEntity extends EntityClass {

      constructor(store: StoreService) {
        super();
        const nsf1 = reflect.getMetadata(META_STORE_NSFACTORY, this);
        const actions = reflect.getMetadata(META_STORE_ACTION, this);
        const selects = reflect.getMetadata(META_STORE_SELECT, this);
        let state: any;
        const getter = (key: string) => {
          console.log('getter');
          return state ? state[key] : undefined;
        };
        const setter = (key: string, value: any) => {
          console.log('setter', `${key},${value}`);
        };
        // field
        state = dealField(this, getter, setter);
        // action
        // select
      }
    }

    // todo 链接angular的依赖注入系统
    // 需要手动模拟出angular对于构造器解析的所有逻辑,如果angular的逻辑修改了呢??
    // 可以考虑Injector.create来实现
    return TheEntity;
  };
}

/**
 * 处理EntityClass中的字段,操作实例属性包括:
 * 1.class 实例化对象时初始化的属性
 * 2.在class contructor中进行初始化的属性
 * 3.在class contructor中动态添加到this中的属性
 * 4.所有父类中上述使用上述方法初始化的属性
 * ps:TODO 属性值为函数将忽略,初始值为函数的属性应当被当做方法处理
 * @param theEntityInstance Entity实例
 * @param getter 获取器
 * @param setter 设置器
 * @return {State}
 */
function dealField(theEntityInstance: any, getter: (key: string) => any, setter: (key: string, value: any) => void): any {
  // 当前theEntityInstance对象是TheEntity的实例
  // 1.通过reflect.ownKeys获取所有
  return reflect.ownKeys(theEntityInstance)
    .reduce((curr: any, key) => {
      curr[key] = theEntityInstance[key];
      reflect.defineProperty(theEntityInstance, key, {
        configurable: false,
        enumerable: true,
        get: function (k) {
          return getter(k);
        }.bind(null, key),
        set: function (k, arg) {
          setter(k, arg);
        }.bind(null, key)
      });
      return curr;
    }, {});
}

export type FieldDecorator = (...args: any[]) => any;
export type FieldDecoratorFactory = () => FieldDecorator;

export function FieldDecoratorFactory() {
  return function (target, propertyKey) {
    console.log('field', arguments);
  };
}

export const Field: FieldDecoratorFactory = FieldDecoratorFactory;

export interface MetatItem {
  name: string;
  value: Function;
}

export type ActionDecorator = (target: any, propertyKey: string, attributes: PropertyDescriptor) => any;
export type ActionDecoratorFactory = () => ActionDecorator;

export function ActionDecoratorFactory() {
  return function (target, propertyKey, attributes) {
    const name = propertyKey;
    console.log(name);
    console.log(target);
    const value = target[propertyKey];
    // 在target上追加action信息
    let actions: MetatItem[] = reflect.getMetadata(META_STORE_ACTION, target);
    actions = isArray(actions) ? actions : [];
    actions.push({name, value});
    reflect.defineMetadata(META_STORE_ACTION, actions, target);
  };
}

export const Action: ActionDecoratorFactory = ActionDecoratorFactory;

export type SelectDecorator = (target: any, propertyKey: string, attributes: PropertyDescriptor) => any;
export type SelectDecoratorFactory = () => SelectDecorator;

export function SelectDecoratorFactory() {
  return function (target, propertyKey, attributes) {
    const name = propertyKey;
    const value = target[propertyKey];
    // 在target上追加action信息
    let selects: MetatItem[] = reflect.getOwnMetadata(META_STORE_SELECT, target);
    selects = isArray(selects) ? selects : [];
    selects.push({name, value});
    reflect.defineMetadata(META_STORE_SELECT, selects, target);
  };
}

export const Select: SelectDecoratorFactory = SelectDecoratorFactory;

export function Empty(): any {
  return () => void 0;
}
