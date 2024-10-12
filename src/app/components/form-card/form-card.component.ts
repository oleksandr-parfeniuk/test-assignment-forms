import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { FormService } from '@shared/services/form.service';
import { Country } from '@shared/enum/country';

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss']
})
export class FormCardComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() countries: Country[] = [];
  @Output() remove = new EventEmitter<void>();
  @Output() checkingUsername = new EventEmitter<boolean>();

  maxDate: string;

  constructor(private formService: FormService) {
    this.maxDate = new Date().toLocaleDateString('en-CA');
  }

  ngOnInit(): void {
    this.checkUsernameAvailability();
  }

  onRemove(): void {
    this.remove.emit();
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(string => string === '' ? []
        : this.countries.filter(v => v.toLowerCase().indexOf(string.toLowerCase()) > -1).slice(0, 10))
    )

  formatter = (country: string) => country;

  checkUsernameAvailability() {
    this.formGroup.get('username')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((username) => {
        if (!username) {
          return of(null);
        }
        this.checkingUsername.emit(true);
        return this.formService.checkUsername(username);
      })
    ).subscribe({
      next: (response: { isAvailable: boolean } | null) => {
        if (response && !response.isAvailable) {
          this.formGroup.get('username')?.setErrors({ unavailable: true });
        } else {
          this.formGroup.get('username')?.setErrors(null);
        }
        this.checkingUsername.emit(false);
      },
      error: (error) => {
        console.error('Error checking username:', error);
        this.checkingUsername.emit(false);
      }
    });
  }
}