import { StoreOptionsToken, StoreService } from './store.service';
import { Action, Entity, Field, Select } from './EntityDecorator';
import { Inject, Injectable, Optional } from '@angular/core';
import { StoreOptions } from './types';

@Injectable()
@Entity('xxx')
export class TestEntity {

  @Field()
  private test = 'lhw';

  @Field()
  private get test1() {
    return 'test1';
  }

  constructor() {
//    console.log(store);
//    console.log(reflect.getMetadataKeys(TestEntity));
//    console.log(reflect.getMetadata('design:paramtypes', TestEntity));
  }

  @Action()
  hello(h1: string, @Field() h2: string, h3?: TestEntity): string {
    return '';
  }

  @Select()
  select(s1: string): string {
    return '';
  }
}
