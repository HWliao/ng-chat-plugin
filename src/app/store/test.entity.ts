import {Action, Entity, Select} from './EntityDecorator';
import {Injectable} from '@angular/core';

class TestEntityPar {
  private sub = '';

  @Action()
  subAction() {
    console.log('subAction');
  }

  @Select()
  subSelect() {
    console.log('subAction');
  }
}

@Injectable()
@Entity('ns')
export class TestEntity extends TestEntityPar {

  test = 'lhw';

  constructor() {
    super();
  }

  @Action()
  hello(h1: string, h2: string, h3?: TestEntity): string {
    return '';
  }

  @Select()
  select(s1: string): string {
    return '';
  }
}
