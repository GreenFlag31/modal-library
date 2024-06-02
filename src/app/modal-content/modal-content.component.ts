import { Component, OnDestroy } from '@angular/core';
import { ModalService } from '../../../projects/ngx-modal-ease/src/public-api';
import { ModalContent2Component } from '../modal-content-2/modal-content-2.component';

@Component({
  selector: 'app-modal-content',
  imports: [],
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.css',
  standalone: true,
})
export class ModalContentComponent {
  name = 'ModalContentComponent';
  constructor(private modalService: ModalService) {}

  onClose() {
    this.modalService.close(this.name);
  }

  onOpen() {
    this.modalService.open(ModalContent2Component, {
      size: {
        width: '400px',
        maxWidth: '100%',
      },
    });
  }
}
