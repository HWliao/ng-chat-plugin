import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImApiConfigEntity } from './im-api-config.entity';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ImApiConfigEntity],
  declarations: []
})
export class ImApiModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ImApiModule
    };
  }
}
