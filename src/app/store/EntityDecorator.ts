import isEmpty from 'lodash-es/isEmpty';
import { META_DESIGN_PARAMTYPES, META_STORE_NSFACTORY, reflect } from './util';
import { Injector } from '@angular/core';

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
    // 为entity定义namespace factory
    reflect.defineMetadata(META_STORE_NSFACTORY, nsFactory, EntityClass);
    // todo 链接angular的依赖注入系统
    // EntityClass构造函数中不能有参数
    // EntityClass要链接到angular di系统中,侵入过大
    // 这里主要实现对EntityClass实例的代理
    const entityClassDesignParamtypes = reflect.getMetadata(META_DESIGN_PARAMTYPES, EntityClass);
    if (!isEmpty(entityClassDesignParamtypes)) {
      throw Error('');
    }
    // 这里加一个空的装饰器,用于typescript自动填充meta-data
    // angular需要依赖meta-data来依赖注入
    @Empty()
    class TheEntity extends EntityClass {
      constructor(private injector: Injector) {
        super();
      }
    }

    window['EntityClass'] = EntityClass;
    window['TheEntity'] = TheEntity;
    // 这里需要动态配置angular di dependencies列表(构造函数的参数列表是动态的)
    // TheEntity 由typescript自动生成的design:paramtypes 在angular di中无法解析
    // angular中通过reflect.getOwnMetadata来获取dependencies

    // design:paramtypes 需要处理成与TheEntity constructor 参数列表顺序一致
    // StoreService 提取到第一位,其他与entityClassDesignParamtypes的顺序保持一致
//    reflect.defineMetadata(META_DESIGN_PARAMTYPES, [...entityClassDesignParamtypes], TheEntity);
//    const ngMetaParameters = EntityClass.hasOwnProperty(META_NG_PARAMETERS) && EntityClass[META_NG_PARAMETERS];
//    console.log(ngMetaParameters);
//    if (ngMetaParameters) {
//      reflect.set(TheEntity, META_NG_PARAMETERS, ngMetaParameters);
//    }
    return TheEntity;
  };
}

export function Field(): any {
  return function FieldDecorator(target: any, propertyKey: string) {
  };
}

export function Action(): any {
  return function ActionDecorator(target: any, propertyKey: string) {
  };
}

export function Empty(): any {
  return () => void 0;
}
