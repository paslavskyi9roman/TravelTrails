import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/************************************************************************************************

<div (appClickOutside)="onOutsideImgClick()"></div>  - add directive to the element
 onOutsideImgClick(){} - create a function to call when user clicks outside of the element

************************************************************************************************/

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output()
  appClickOutside: EventEmitter<void> = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: PointerEvent): void {
    const nativeElement: HTMLElement = this.elementRef.nativeElement;
    const clickedInside: boolean = nativeElement.contains(event.target as Node);
    if (!clickedInside) {
      this.appClickOutside.emit();
    }
  }
}
