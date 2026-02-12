import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { forkJoin } from 'rxjs';

import {
  CustomFormBuilder,
  FormControls,
} from '../../../utils/reactive-form.utils';
import { ClientsService } from '../services/clients.service';
import { DogsService } from '../../dogs/services/dogs.service';
import {
  ClientFormModel,
  ClientCreateRequest,
  clientInitialModel,
  clientFormValidators,
} from '../models/clients.model';
import {
  DogCreateRequest,
  dogFormValidators,
  dogInitialModel,
} from '../../dogs/models/dogs.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent {
  private readonly clientsService = inject(ClientsService);
  private readonly dogsService = inject(DogsService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Create form using CustomFormBuilder
  clientForm: FormGroup<FormControls<ClientFormModel>> =
    CustomFormBuilder.buildFormGroup(clientInitialModel, clientFormValidators);

  get dogsArray(): FormArray {
    return this.clientForm.get('dogs') as FormArray;
  }

  addDog(): void {
    const dogGroup = CustomFormBuilder.buildFormGroup(
      dogInitialModel,
      dogFormValidators,
    );

    this.dogsArray.push(dogGroup);
  }

  removeDog(index: number): void {
    this.dogsArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.clientForm.value as ClientFormModel;

    // Create client request
    const clientRequest: ClientCreateRequest = {
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      email: formValue.email!,
      phone: formValue.phone!,
      addressLine1: formValue.addressLine1 || undefined,
      city: formValue.city || undefined,
      state: formValue.state || undefined,
      zip: formValue.zip || undefined,
    };

    // First, create the client
    this.clientsService.createClient(clientRequest).subscribe({
      next: (response) => {
        const clientId = response.id;

        // If there are dogs, create them
        if (formValue.dogs && formValue.dogs.length > 0) {
          const dogRequests = formValue.dogs.map((dog) => {
            const dogRequest: DogCreateRequest = {
              clientId: clientId,
              name: dog!.name!,
              breed: dog!.breed!,
              birthDate: dog!.birthDate || undefined,
              notes: dog!.notes || undefined,
              isActive: dog!.isActive!,
            };
            return this.dogsService.createDog(dogRequest);
          });

          // Create all dogs in parallel
          forkJoin(dogRequests).subscribe({
            next: () => {
              this.isLoading.set(false);
              this.router.navigate(['/clients']);
            },
            error: (error) => {
              this.isLoading.set(false);
              this.errorMessage.set(
                'Client created, but there was an error creating the dogs: ' +
                  (error.error?.message || error.message),
              );
            },
          });
        } else {
          // No dogs to create, just navigate
          this.isLoading.set(false);
          this.router.navigate(['/clients']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Error creating client');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.clientForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Invalid email';
    if (control.errors['minlength'])
      return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['maxlength'])
      return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
    if (control.errors['pattern']) return 'Invalid format';

    return 'Validation error';
  }

  getDogErrorMessage(index: number, fieldName: string): string {
    const control = this.dogsArray.at(index).get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) return 'Required';
    if (control.errors['maxlength'])
      return `Max. ${control.errors['maxlength'].requiredLength}`;

    return 'Error';
  }
}
