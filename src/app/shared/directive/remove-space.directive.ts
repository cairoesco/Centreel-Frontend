import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRemoveSpace]'
})
export class RemoveSpaceDirective {
  private specialKeys: Array<string> = [' '];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) == -1) {
      return;
    }
    event.preventDefault();
  }
}