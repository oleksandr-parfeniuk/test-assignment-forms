import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Country } from '../enum/country';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  constructor(private fb: FormBuilder) {}

  createFormCard(): FormGroup {
    return this.fb.group({
      country: ['', [Validators.required, this.countryValidator()]],
      username: ['', Validators.required],
      birthday: ['', [Validators.required, this.birthdayValidator()]]
    });
  }

  private countryValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const valid = Object.values(Country).includes(control.value as Country);
      return valid ? null : {'invalidCountry': {value: control.value}};
    };
  }
  
  private birthdayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
    
      if (!value) {
        return null;
      }

      const birthday = new Date(value);
      const today = new Date();

      if (birthday > today) {
        return { 'futureDate': true };
      }
      return null;
    };
  }
}