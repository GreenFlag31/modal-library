import { ComponentRef } from '@angular/core';

export interface PromiseModal {
  resolve: Function;
  contentCpRef: ComponentRef<any>;
}
