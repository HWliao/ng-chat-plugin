import {Component} from '@angular/core';
import {ImApiConfigEntity} from './im-api/im-api-config.entity';
import {StoreService} from './store/store.service';
import {TestEntity} from './store/test.entity';
import {AppModule} from './app.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private config: ImApiConfigEntity, store: StoreService, test: TestEntity) {
    // console.log(test.test);
    // test.test = 'setter test';
  }
}
