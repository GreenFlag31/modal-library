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
  M2Information = '';
  M3Information!: unknown;
  constructor(private modalService: ModalService) {}

  onOpenM1() {
    this.modalService.open(ModalContentComponent, {
      modal: {
        enter: 'modal-enter-scale-down 0.1s ease-out',
      },
      overlay: {
        leave: 'fade-out 0.3s',
      },
      size: {
        padding: '1rem',
      },
    });
  }

  onOpenM2() {
    this.modalService.open(ModalContent3Component, {
      modal: {
        enter: 'modal-enter-going-down 0.2s ease-out',
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
          enter: 'modal-enter-scaling 0.2s',
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
