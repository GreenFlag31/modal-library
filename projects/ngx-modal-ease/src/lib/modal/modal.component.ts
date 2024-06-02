import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';
import { Options, SubjectModal } from './modal-options';
import { Observable, Subscription, filter, fromEvent } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modal') modal!: ElementRef<HTMLDivElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;
  options!: Options | undefined;
  modalAnimationEnd!: Observable<Event>;
  overlayAnimationEnd!: Observable<Event>;
  modalLeaveAnimation = '';
  overlayLeaveAnimation = '';
  overlayClosed = false;
  modalClosed = false;
  layerLevel = 0;
  escapeKeySubscription!: Subscription;

  constructor(
    private modalService: ModalService,
    private element: ElementRef<HTMLElement>
  ) {}

  /**
   * Initialise variable and escape key on document.
   * Multiple modals might register multiple event listener, hence the 'layerLevel' variable and two times the condition check for the escape option.
   */
  ngOnInit() {
    this.options = this.modalService.options;
    this.modalService.modalInstances.push(this);
    this.modalService.layerLevel += 1;
    this.layerLevel = this.modalService.layerLevel;

    if (this.options?.actions?.escape === false) return;

    this.escapeKeySubscription = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(filter((event) => event.key === 'Escape'))
      .subscribe(() => {
        if (this.options?.actions?.escape === false) return;

        if (this.layerLevel === this.modalService.layerLevel) {
          this.modalService.close();
        }
      });
  }

  onClose() {
    if (this.options?.actions?.click === false) return;

    this.modalService.close();
  }

  ngAfterViewInit() {
    this.addOptionsAndAnimations();
  }

  /**
   * Add options and animations
   * Apply user style and animations, listen to animation ends. Apply z-indexes on overlay and modal, with 1000 as incremental value.
   */
  addOptionsAndAnimations() {
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

    this.modalAnimationEnd = fromEvent(
      this.modal.nativeElement,
      'animationend'
    );
    this.overlayAnimationEnd = fromEvent(
      this.overlay.nativeElement,
      'animationend'
    );
  }

  removeElementIfNotAnimated(element: HTMLDivElement, animation: string) {
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
  close(modalSubject: SubjectModal) {
    this.modalService.layerLevel -= 1;
    this.modal.nativeElement.style.animation = this.modalLeaveAnimation;
    this.overlay.nativeElement.style.animation = this.overlayLeaveAnimation;
    this.escapeKeySubscription?.unsubscribe();

    // First: no animations on both elements
    if (!this.modalLeaveAnimation && !this.overlayLeaveAnimation) {
      this.element.nativeElement.remove();
      modalSubject.contentCpRef.destroy();
      return;
    }

    // Second: 1/2 animated, remove directly element if not animated
    this.removeElementIfNotAnimated(
      this.modal.nativeElement,
      this.modalLeaveAnimation
    );
    this.removeElementIfNotAnimated(
      this.overlay?.nativeElement,
      this.overlayLeaveAnimation
    );

    // Third: Both animated with differents animation time
    this.modalAnimationEnd.subscribe(() => {
      this.modal.nativeElement.remove();
      this.modalClosed = true;
      this.removeModalComponent(modalSubject);
    });
    this.overlayAnimationEnd.subscribe(() => {
      this.overlay.nativeElement.remove();
      this.overlayClosed = true;
      this.removeModalComponent(modalSubject);
    });
  }

  /**
   * Remove element once both animations finish.
   * Remove component through the Angular API to trigger the onDestroy event.
   */
  removeModalComponent(modalSubject: SubjectModal) {
    if (this.modalClosed && this.overlayClosed) {
      this.element.nativeElement.remove();
      modalSubject.contentCpRef.destroy();
    }
  }
}
