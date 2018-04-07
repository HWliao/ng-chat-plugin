import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreService } from './store.service';

@NgModule({
  imports: [],
  providers: [StoreService],
  declarations: []
})
export class StoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: StoreModule
    };
  }
}
