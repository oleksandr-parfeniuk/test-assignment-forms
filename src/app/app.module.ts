import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from "@angular/router";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { MockBackendInterceptor } from "@shared/mock-backend/mock-backend.interceptor";
import { FormService } from '@shared/services/form.service';
import { FormContainerComponent } from '@components/form-container/form-container.component';
import { FormCardComponent } from '@components/form-card/form-card.component';
import { InputValidationDirective } from '@shared/directives/input-validation.directive';

@NgModule({
  declarations: [
    AppComponent,
    FormContainerComponent,
    FormCardComponent,
    InputValidationDirective
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true },
    FormService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
