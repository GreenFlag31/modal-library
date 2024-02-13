import { Component } from '@angular/core';
import { ModalService } from '../../../projects/ngx-modal-ease/src/public-api';
import { ModalContentTest1Component } from '../modal-content-test-1/modal-content-test-1.component';

@Component({
  selector: 'app-modal-content-2',
  standalone: true,
  imports: [],
  templateUrl: './modal-content-2.component.html',
  styleUrl: './modal-content-2.component.css',
})
export class ModalContent2Component {
  constructor(private modalService: ModalService) {}

  onClose() {
    this.modalService.close();
  }

  onOpen() {
    this.modalService.open(ModalContentTest1Component, {
      size: {
        width: '400px',
        maxWidth: '100%',
      },
    });
  }
}
