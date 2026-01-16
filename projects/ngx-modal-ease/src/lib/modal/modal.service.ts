import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Inject,
  Injectable,
  PLATFORM_ID,
  Type,
  createComponent,
} from '@angular/core';
import { ModalComponent } from './modal.component';
import { ModalResponse, Options } from './modal-options';
import { isPlatformBrowser } from '@angular/common';
import { PromiseModal } from './internal-interfaces';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private libraryComponent!: ComponentRef<ModalComponent>;
  private userComponent!: ComponentRef<any>;
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
  /**
   * Internal use only.
   */
  closedOnClickOrEscape = false;
  private isBrowser = true;
  private promiseContainer: PromiseModal[] = [];

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Opens a custom component within a modal.
   * @param componentToCreate The custom component to display within the modal.
   * @param options Additional options for configuring the modal appearance and animations.
   * @returns A Promise that will emit custom data on closing the modal.
   * ```
   * this.modalService.open(ModalContentComponent, {
   *   modal: {
   *     enter: 'enter-scale-down 0.1s ease-out',
   *     leave: 'fade-out 0.5s',
   *   },
   *   overlay: {
   *     leave: 'fade-out 0.3s',
   *   },
   *   data: {
   *     type: 'Angular modal library',
   *   },
   * })
   * .then((dataFromComponent) => {
   *    ...
   * });
   * ```
   */
  open<C>(componentToCreate: Type<C>, options?: Options) {
    this.options = options;
    this.openComponent(componentToCreate, options);

    return new Promise<ModalResponse>((resolve) => {
      if (!this.isBrowser) return;
      this.promiseContainer.push({
        resolve,
        userComponent: this.userComponent,
        libraryComponent: this.libraryComponent,
      });
    });
  }

  private openComponent<C>(componentToCreate: Type<C>, options?: Options) {
    if (!this.isBrowser) return;

    this.userComponent = createComponent(componentToCreate, {
      environmentInjector: this.injector,
      elementInjector: options?.injector,
    });

    this.libraryComponent = createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [[this.userComponent.location.nativeElement]],
    });

    this.instantiateProps(options?.data);

    this.appRef.attachView(this.userComponent.hostView);
    this.appRef.attachView(this.libraryComponent.hostView);
    document.body.appendChild(this.libraryComponent.location.nativeElement);
  }

  /**
   * Set user provided data into the component instance.
   */
  private instantiateProps(data: Options['data'] = {}) {
    for (const key of Object.keys(data)) {
      this.userComponent.instance[key] = data[key];
    }
  }

  /**
   * Close the current modal.
   * @param data The optional data to emit on closing the modal (communication from modal to caller).
   */
  close(data?: unknown) {
    if (this.promiseContainer.length === 0) return;

    const { userComponent, libraryComponent, resolve } =
      this.promiseContainer.pop()!;
    this.modalInstances.pop()?.close(userComponent);

    const response = {
      closedOnClickOrEscape: this.closedOnClickOrEscape,
      data,
    };

    this.closedOnClickOrEscape = false;
    this.appRef.detachView(userComponent.hostView);
    this.appRef.detachView(libraryComponent.hostView);

    return resolve(response);
  }

  /**
   * Close all modal instances.
   * Respective animations will be applied.
   */
  closeAll() {
    for (let i = this.modalInstances.length - 1; i > -1; i--) {
      this.close();
    }
  }
}
