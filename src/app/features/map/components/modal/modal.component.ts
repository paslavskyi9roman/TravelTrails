import { Component, Input, effect, signal } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() showModal = signal(false);
  @Input() eventPos = signal({ x: 0, y: 0 });
  @Input() data: any;

  openModal(): void {
    effect((): void => {
      this.showModal.set(true);
    });
  }
}
