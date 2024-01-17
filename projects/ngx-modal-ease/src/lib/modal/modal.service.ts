import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  Type,
  createComponent,
} from '@angular/core';
import { ModalComponent } from './modal.component';
import { Options } from './modal-options';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private newModalComponent!: ComponentRef<ModalComponent>;
  private newComponent!: ComponentRef<any>;
  private modalSubject!: Subject<unknown>;
  /**
   * Internal use only.
   */
  options!: Options | undefined;
  /**
   * Internal use only.
   */
  modalInstances: ModalComponent[] = [];
  /**
   * Internal use only.
   */
  layerLevel = 0;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  /**
   * Opens a custom component within a modal.
   * @param componentToCreate The custom component to display within the modal.
   * @param options Additional options for configuring the modal appearance and animations.
   * @returns A RxJs Subject that will emit custom data on closing the modal.
   * ```
   * this.modalService.open(ModalContentComponent, {
   *   modal: {
   *     enter: 'modal-enter-scale-down 0.1s ease-out',
   *     leave: 'fade-out 0.5s',
   *   },
   *   overlay: {
   *     leave: 'fade-out 0.3s',
   *   },
   *   data: {
   *     type: 'Angular modal library',
   *   },
   * })
   * .subscribe((dataFromComponent) => {
   *    ...
   * });
   * ```
   */
  open<C>(componentToCreate: Type<C>, options?: Options) {
    this.options = options;
    this.openComponent(componentToCreate, options);

    this.modalSubject = new Subject();
    return this.modalSubject;
  }

  private openComponent<C>(componentToCreate: Type<C>, options?: Options) {
    this.newComponent = createComponent(componentToCreate, {
      environmentInjector: this.injector,
    });

    this.newModalComponent = createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [[this.newComponent.location.nativeElement]],
    });

    this.instantiateProps(options?.data);
    document.body.appendChild(this.newModalComponent.location.nativeElement);

    this.appRef.attachView(this.newComponent.hostView);
    this.appRef.attachView(this.newModalComponent.hostView);
  }

  private instantiateProps(data: Options['data'] = {}) {
    for (const key of Object.keys(data)) {
      this.newComponent.instance[key] = data[key];
    }
  }

  /**
   * Close the current modal.
   * @param data The optional data to emit on closing the modal (communication from callee to caller).
   */
  close(data?: unknown) {
    this.newModalComponent.instance.close();
    this.options = undefined;

    this.modalSubject.next(data);
    this.modalSubject.complete();
  }

  /**
   * Close all modal instances.
   * Respective animations will be applied.
   */
  closeAll() {
    for (let i = this.modalInstances.length - 1; i > -1; i--) {
      this.modalInstances[i].close();
    }
  }
}
