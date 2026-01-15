import { Component } from '@angular/core';
import { ModalService } from '../../../projects/ngx-modal-ease/src/public-api';

@Component({
    selector: 'app-modal-content-3',
    imports: [],
    templateUrl: './modal-content-3.component.html',
    styleUrl: './modal-content-3.component.css'
})
export class ModalContent3Component {
  name = 'ModalContent3Component';
  M2Info = '';

  constructor(private modalService: ModalService) {}

  onClose() {
    this.modalService.close();
  }
}
