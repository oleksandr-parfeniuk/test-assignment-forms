import { Directive, ElementRef, Renderer2, Input, OnInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appInputValidation]'
})
export class InputValidationDirective implements OnInit, OnDestroy {
  @Input() customErrorMessages: { [key: string]: string } = {};
  private statusChanges: Subscription | undefined;
  private errorSpan: HTMLSpanElement | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  ngOnInit(): void {
    this.statusChanges = this.control.statusChanges?.subscribe(() => {
      this.updateValidationState()
    })
  }

  ngOnDestroy(): void {
    this.statusChanges?.unsubscribe();
  }

  private updateValidationState(): void {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      this.setErrorState();
    } else {
      this.clearErrorState();
    }
  }
  
  private setErrorState(): void {
    this.renderer.addClass(this.el.nativeElement, 'is-invalid');
    this.showErrorMessage();
  }

  private clearErrorState(): void {
    this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
    this.removeErrorMessage();
  }

  private showErrorMessage() {
    this.removeErrorMessage();

    const errors = this.control.errors;
    if (errors) {
      const errorKey = Object.keys(errors)[0];
      const message = this.getErrorMessage(errorKey);

      this.errorSpan = this.renderer.createElement('span');
      this.renderer.addClass(this.errorSpan, 'invalid-feedback');
      const text = this.renderer.createText(message);
      this.renderer.appendChild(this.errorSpan, text);
      this.renderer.appendChild(this.el.nativeElement.parentNode, this.errorSpan);
    }
  }
  
  private removeErrorMessage() {
    if (this.errorSpan) {
      this.renderer.removeChild(this.el.nativeElement.parentNode, this.errorSpan);
      this.errorSpan = undefined;
    }
  }

  private getErrorMessage(errorKey: string): string {
    // Added more possible messages for better user experience.
    // There is a possibility pass custom messages via customErrorMessages or extend 'switch' with other messages
    if (this.customErrorMessages && this.customErrorMessages[errorKey]) {
      return this.customErrorMessages[errorKey];
    }

    switch (errorKey) {
      case 'required':
        return 'This field is required.';
      case 'futureDate':
        return 'Birthday cannot be in the future.';
      default:
        return 'Invalid input.';
    }
  }
}