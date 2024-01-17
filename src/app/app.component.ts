import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ModalService } from '../../projects/ngx-modal-ease/src/public-api';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { ModalContent3Component } from './modal-content-3/modal-content-3.component';
import { FormsModule } from '@angular/forms';
import { ModalContent4Component } from './modal-content-4/modal-content-4.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  M1 = {
    animation: 'modal-enter-scale-down',
    duration: '0.1s',
    easing: 'ease-out',
  };
  M2 = {
    animation: 'modal-enter-going-down',
    duration: '0.1s',
    easing: 'ease-out',
  };
  M3 = {
    animation: 'modal-enter-scaling',
    duration: '0.2s',
    easing: 'linear',
  };
  M2Information = '';
  M3Information!: unknown;

  constructor(private modalService: ModalService) {}

  onOpenM1() {
    this.modalService.open(ModalContentComponent, {
      modal: {
        enter: `${this.M1.animation} ${this.M1.duration} ${this.M1.easing}`,
      },
      overlay: {
        leave: 'fade-out 0.3s',
      },
      size: {
        padding: '1rem',
        width: '600px',
      },
    });
  }

  onOpenM2() {
    this.modalService.open(ModalContent3Component, {
      modal: {
        enter: `${this.M2.animation} ${this.M2.duration} ${this.M2.easing}`,
      },
      size: {
        padding: '0.5rem',
      },
      data: {
        M2Info: this.M2Information,
      },
    });
  }

  onOpenM3() {
    this.modalService
      .open(ModalContent4Component, {
        modal: {
          enter: `${this.M3.animation} ${this.M3.duration}`,
        },
        size: {
          padding: '0.5rem',
        },
      })
      .subscribe((data) => {
        this.M3Information = data || '🚫 No data';
      });
  }
}
