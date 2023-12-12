import { Component, Input, effect, signal } from '@angular/core';
import { FeatureModel } from 'src/app/models/feature.model';

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

  openModal() {
    effect(() => {
      this.showModal.set(true);
    });
  }
}
