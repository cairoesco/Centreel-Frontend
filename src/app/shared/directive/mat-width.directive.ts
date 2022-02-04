import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[matWidth]'
})
export class MatWidthDirective {
  @Input('matWidth') option:any; 
  constructor(private el: ElementRef,private renderer: Renderer2) {
    
  }
  ngAfterContentInit() {
    let that=this;
    this.renderer.setStyle(this.el.nativeElement, 'width', that.option + 'px');
  }
}
