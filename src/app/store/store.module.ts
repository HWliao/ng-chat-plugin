import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreOptionsToken, StoreService } from './store.service';

@NgModule({
  imports: [],
  providers: [],
  declarations: []
})
export class StoreModule {
  static forRoot(ops: any = { test: 1 }): ModuleWithProviders {
    return {
      ngModule: StoreModule,
      providers: [
        { provide: StoreOptionsToken, useValue: ops },
        StoreService
      ]
    };
  }
}
