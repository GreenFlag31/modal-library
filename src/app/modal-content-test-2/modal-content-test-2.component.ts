import { Component } from '@angular/core';
import { ModalService } from '../../../projects/ngx-modal-ease/src/public-api';

@Component({
  selector: 'app-modal-content-test-2',
  standalone: true,
  imports: [],
  templateUrl: './modal-content-test-2.component.html',
  styleUrl: './modal-content-test-2.component.css',
})
export class ModalContentTest2Component {
  constructor(private modalService: ModalService) {}

  onClose() {
    this.modalService.close();
  }
}
