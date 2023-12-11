import { Component, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  standalone: true,
})
export class TooltipComponent {
  @Input() content: string | undefined;
  isTooltipVisible = false;

  @HostListener('mouseenter')
  showTooltip(): void {
    this.isTooltipVisible = true;
  }

  @HostListener('mouseleave')
  hideTooltip(): void {
    this.isTooltipVisible = false;
  }

}
