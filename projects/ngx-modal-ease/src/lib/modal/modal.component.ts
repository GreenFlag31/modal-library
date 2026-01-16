import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
  ComponentRef,
} from '@angular/core';

import { ModalService } from './modal.service';
import { Options } from './modal-options';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modal') modal!: ElementRef<HTMLDivElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;
  options!: Options | undefined;
  modalLeaveAnimation = '';
  overlayLeaveAnimation = '';
  overlayClosed = false;
  modalClosed = false;
  layerLevel = 0;

  constructor(
    private modalService: ModalService,
    private element: ElementRef<HTMLElement>,
  ) {}

  ngOnInit() {
    this.options = this.modalService.options;
    this.modalService.modalInstances.push(this);
    this.modalService.layerLevel += 1;
    this.layerLevel = this.modalService.layerLevel;

    if (this.options?.actions?.escape === false) return;

    document.addEventListener('keydown', this.handleEscape);
  }

  ngAfterViewInit() {
    this.addOptionsAndAnimations();
  }

  /**
   * Multiple modals might register multiple event listener, hence the 'layerLevel' variable and two times the condition check for the escape option.
   * Arrow function to respect the this instance.
   */
  private handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (this.options?.actions?.escape === false) return;

      if (this.layerLevel === this.modalService.layerLevel) {
        this.modalService.closedOnClickOrEscape = true;
        this.modalService.close();
      }
    }
  };

  onClose() {
    if (this.options?.actions?.click === false) return;
    this.modalService.closedOnClickOrEscape = true;
    this.modalService.close();
  }

  /**
   * Add options and animations
   * Apply user style and animations, listen to animation ends. Apply z-indexes on overlay and modal, with 1000 as incremental value.
   */
  private addOptionsAndAnimations() {
    this.modal.nativeElement.style.width = this.options?.size?.width || '';
    this.modal.nativeElement.style.maxWidth =
      this.options?.size?.maxWidth || '';
    this.modal.nativeElement.style.height = this.options?.size?.height || '';
    this.modal.nativeElement.style.maxHeight =
      this.options?.size?.maxHeight || '';
    this.modal.nativeElement.style.padding =
      this.options?.size?.padding || '0.5rem';

    const overlayZIndex = 1000 * this.modalService.modalInstances.length;
    this.overlay.nativeElement.style.zIndex = `${overlayZIndex}`;
    this.modal.nativeElement.style.zIndex = `${overlayZIndex + 1000}`;

    this.modalLeaveAnimation = this.options?.modal?.leave || '';
    this.overlayLeaveAnimation = this.options?.overlay?.leave || '';
    this.modal.nativeElement.style.animation = this.options?.modal?.enter || '';
    this.modal.nativeElement.style.top = this.options?.modal?.top || '50%';
    this.modal.nativeElement.style.left = this.options?.modal?.left || '50%';

    this.overlay.nativeElement.style.animation =
      this.options?.overlay?.enter || '';
    this.overlay.nativeElement.style.backgroundColor =
      this.options?.overlay?.backgroundColor || '';
  }

  private removeElementIfNotAnimated(
    element: HTMLDivElement,
    animation: string,
  ) {
    if (!animation) {
      element.remove();

      if (element.classList.contains('ngx-modal')) {
        this.modalClosed = true;
      } else {
        this.overlayClosed = true;
      }
    }
  }

  /**
   * Clean the DOM
   * Apply the leaving animations and clean the DOM. Three different use cases.
   * Last In First Out
   */
  close(userComponent: ComponentRef<any>) {
    this.modalService.layerLevel -= 1;

    this.modal.nativeElement.style.animation = this.modalLeaveAnimation;
    this.overlay.nativeElement.style.animation = this.overlayLeaveAnimation;
    document.removeEventListener('keydown', this.handleEscape);

    // First: no animations on both elements
    if (!this.modalLeaveAnimation && !this.overlayLeaveAnimation) {
      this.element.nativeElement.remove();
      userComponent.destroy();
      return;
    }

    // Second: 1/2 animated, remove directly element if not animated
    this.removeElementIfNotAnimated(
      this.modal.nativeElement,
      this.modalLeaveAnimation,
    );
    this.removeElementIfNotAnimated(
      this.overlay?.nativeElement,
      this.overlayLeaveAnimation,
    );

    // Third: Both animated with differents animation time, remove modal component as soon as last one ends
    this.modal.nativeElement.addEventListener('animationend', () => {
      this.modal.nativeElement.remove();
      this.modalClosed = true;
      this.removeModalComponent(userComponent);
    });
    this.overlay.nativeElement.addEventListener('animationend', () => {
      this.overlay.nativeElement.remove();
      this.overlayClosed = true;
      this.removeModalComponent(userComponent);
    });
  }

  /**
   * Remove modal when both animations come to an end.
   */
  private removeModalComponent(userComponent: ComponentRef<any>) {
    if (this.modalClosed && this.overlayClosed) {
      this.element.nativeElement.remove();
      userComponent.destroy();
    }
  }
}
