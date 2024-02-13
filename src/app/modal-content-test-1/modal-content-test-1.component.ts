import { Component } from '@angular/core';

import { ModalContentTest2Component } from '../modal-content-test-2/modal-content-test-2.component';
import { ModalService } from '../../../projects/ngx-modal-ease/src/public-api';

@Component({
  selector: 'app-modal-content-test-1',
  standalone: true,
  imports: [],
  templateUrl: './modal-content-test-1.component.html',
  styleUrl: './modal-content-test-1.component.css',
})
export class ModalContentTest1Component {
  constructor(private modalService: ModalService) {}

  onClose() {
    this.modalService.close();
  }

  onOpen() {
    this.modalService.open(ModalContentTest2Component, {
      modal: {
        leave: 'fade-out 0.5s',
        top: '40%',
      },
    });
  }
}
