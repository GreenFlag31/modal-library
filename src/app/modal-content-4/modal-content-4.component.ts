import { Component } from '@angular/core';
import { ModalService } from '../../../projects/ngx-modal-ease/src/public-api';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-modal-content-4',
    imports: [FormsModule],
    templateUrl: './modal-content-4.component.html',
    styleUrl: './modal-content-4.component.css'
})
export class ModalContent4Component {
  name = 'ModalContent4Component';
  M3Info = '';

  constructor(private modalService: ModalService) {}

  onConfirm() {
    this.modalService.close(this.M3Info);
  }
}
