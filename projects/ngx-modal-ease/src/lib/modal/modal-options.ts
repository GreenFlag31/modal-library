import { ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';

export interface Options {
  modal?: {
    enter?: string;
    leave?: string;
    top?: string;
    left?: string;
  };
  overlay?: {
    enter?: string;
    leave?: string;
    backgroundColor?: string;
  };
  size?: {
    height?: string;
    maxHeight?: string;
    width?: string;
    maxWidth?: string;
    padding?: string;
  };
  actions?: {
    escape?: boolean;
    click?: boolean;
  };
  data?: {
    [key: string]: unknown;
  };
}

export interface SubjectModal {
  subject: Subject<unknown>;
  contentCpRef: ComponentRef<any>;
}
