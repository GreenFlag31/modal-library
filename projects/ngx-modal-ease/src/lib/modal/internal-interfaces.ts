import { ComponentRef } from '@angular/core';

export interface PromiseModal {
  resolve: Function;
  userComponent: ComponentRef<any>;
  libraryComponent: ComponentRef<any>;
}
