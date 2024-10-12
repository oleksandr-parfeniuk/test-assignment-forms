## Starting the App

Run `npm i` to install dependencies first, and then run `ng s` to start the app.

## Project Structure

- `src/app/app.component.*`: Main application component
- `src/app/components/form-container/*`: Form container component managing multiple form cards
- `src/app/components/form-card/*`: Individual form card component
- `src/app/shared/directives/*`: Custom directives (input validation)
- `src/app/shared/services/*`: Shared services (form service, form builder service)
- `src/app/shared/enum/*`: Shared enums (country)
- `src/app/shared/interface/*`: Shared interfaces (responses)
- `src/app/shared/mock-backend/*`: Mock backend interceptor

## Acceptance criteria:

- [+] All form validations work
- [+] Tooltip directive works
- [+] Amount of invalid forms shown
- [+] Adding more form cards works
- [+] Removing form cards works
- [+] Submit with timer works
- [+] Cancel submit works

## What was done additionally:

`src/app/components/form-container/*`

- Created to orchestrate the creation, removal, and submission of multiple form cards
- Disabled the "Submit all forms" button when the length of the form array is zero
- Added additional blocking of the "Submit all forms" button when validating the username on the server

`src/app/components/form-card/*`

- Created to encapsulate the logic and UI for a single form card
- Added a delay after username input just before server request to optimize server requests during quick typing

`src/app/shared/services/form-builder.service.ts`

- Created to centralize form creation and custom validation logic

`src/app/shared/services/form.service.ts`

- Created to handle API calls related to form submission and username checking

`src/app/shared/directives/input-validation.directive.ts`

- Created to enhance form input validation with dynamic error messages
- Provided custom input validation visualization
- Expanded validation messages to improve user experience
- Since Bootstrap is connected, used its "is-invalid" and "invalid-feedback" classes when writing the directive to validate fields and validation messages
