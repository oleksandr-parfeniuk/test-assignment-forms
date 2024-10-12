import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { Subscription, timer } from "rxjs";
import { take } from 'rxjs/operators';

import { FormService } from '@shared/services/form.service';
import { FormBuilderService } from '@shared/services/form-builder.service';
import { Country } from '@shared/enum/country';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss']
})
export class FormContainerComponent implements OnInit {
  formGroup: FormGroup;
  countries: Country[] = Object.values(Country);
  isSubmitting: boolean = false;
  timer: Subscription | null = null;
  remainingTimeInSeconds: number = 5;
  checkingUsernames: boolean[] = [];

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private formBuilderService: FormBuilderService
  ) {
    this.formGroup = this.fb.group({
      forms: this.fb.array([])
    });
  }

  ngOnInit() {
    this.addFormCard();
  }

  get formArray(): FormArray {
    return this.formGroup.get('forms') as FormArray;
  }
  
  get invalidFormsCount(): number {
    return this.formArray.controls.filter((control: AbstractControl) => this.isFormInvalid(control)).length;
  }

  isFormInvalid(control: AbstractControl): boolean {
    const formGroup = control as FormGroup;
    return Object.values(formGroup.controls).some(
      (ctrl: AbstractControl) => ctrl.invalid && ctrl.dirty && ctrl.touched
    );
  }

  addFormCard(): void {
    if (this.formArray.length < 10) {
      const newForm = this.formBuilderService.createFormCard();
      this.formArray.push(newForm);
      this.checkingUsernames.push(false);
    }
  }

  removeFormCard(index: number): void {
    this.formArray.removeAt(index);
    this.checkingUsernames.splice(index, 1);
  }

  getFormGroup(index: number): FormGroup {
    return this.formArray.at(index) as FormGroup;
  }
  
  onSubmit(): void {
    if (this.formGroup.valid) {
      this.isSubmitting = true;
      this.disableAllForms();
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timer = timer(0, 1000).pipe(take(6)).subscribe(
      (count) => {
        this.remainingTimeInSeconds = 5 - count;
        if (count === 5) {
          this.submitForms();
        }
      }
    );
  }

  cancelSubmission(): void {
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.isSubmitting = false;
    this.enableAllForms();
    this.remainingTimeInSeconds = 5;
  }

  submitForms(): void {
    this.formService.submitForms(this.formArray.value).subscribe({
      next: (response: any) => {
        console.log('Forms submitted successfully:', response);

        // Clearing formArray after submission. 
        // Use clearAllFormsValues() instead, when need functionality to clear values in each form and save counts of forms.
        this.formArray.clear();

        if (this.formArray?.length === 0) {
          // Add form card only after clearing formArray.
          this.addFormCard();
        }
      },
      error: (error) => {
        console.error('Error submitting forms:', error);
      },
      complete: () => {
        this.isSubmitting = false;
        this.enableAllForms();
      }
    });
  }

  disableAllForms(): void {
    this.formArray.controls.forEach(form => {
      form.disable();
    });
  }

  enableAllForms(): void {
    this.formArray.controls.forEach(form => {
      form.enable();
    });
  }

  updateServerCheckingState(index: number, isChecking: boolean) {
    this.checkingUsernames[index] = isChecking;
  }

  isAnyActiveServerChecking(): boolean {
    return this.checkingUsernames.some(isChecking => isChecking);
  }

  canSubmitForms(): boolean {
    return !this.formGroup.invalid && this.formArray.length > 0 && !this.isAnyActiveServerChecking();
  }

  canAddFormCard(): boolean {
    return this.formArray.length < 10 && !this.isSubmitting;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  // ATTENTION, additional code, only because of an unclear assignment condition.
  // Uncomment next function when need functionality to clear values in each form and save counts of forms after submission, call it instead this.formArray.clear().
  // clearAllFormsValues() {
  //   this.formArray.controls.forEach((control: AbstractControl) => {
  //   const formGroup = control as FormGroup;
  //     Object.keys(formGroup.controls).forEach(key => {
  //       formGroup.get(key)?.reset();
  //     });
  //   });
  // }
}