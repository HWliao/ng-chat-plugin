import { StoreOptionsToken, StoreService } from './store.service';
import { Action, Entity, Field } from './EntityDecorator';
import { Inject, Injectable, Optional } from '@angular/core';
import { StoreOptions } from './types';

@Injectable()
@Entity('xxx')
export class TestEntity {

  @Field()
  private test = 'lhw';

  constructor() {
//    console.log(store);
//    console.log(reflect.getMetadataKeys(TestEntity));
//    console.log(reflect.getMetadata('design:paramtypes', TestEntity));
  }

  @Action()
  hello(h1: string, h2: string, h3?: TestEntity): string {
    return '';
  }
}
