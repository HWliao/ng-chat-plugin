import { Component } from '@angular/core';
import { ImApiConfigEntity } from './im-api/im-api-config.entity';
import { StoreService } from './store/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private config: ImApiConfigEntity, store: StoreService) {
    console.log(config);
    window['store'] = store;
  }
}
