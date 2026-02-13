import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../../core/services/snack-bar.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
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
  ClientDetailDto,
} from '../models/clients.model';
import {
  DogCreateRequest,
  DogUpdateRequest,
  dogFormValidators,
  dogInitialModel,
  DogFormModel,
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
export class ClientFormComponent implements OnInit {
  private readonly _clientsService = inject(ClientsService);
  private readonly _dogsService = inject(DogsService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _snackbar = inject(SnackbarService);
  private readonly _confirmationService = inject(ConfirmationService);

  isLoading = signal(false);
  loadingDogIndex = signal<number | null>(null); // Track which dog is being saved
  errorMessage = signal<string | null>(null);
  isEditMode = signal(false);
  title = signal('New Client');
  clientId: string | null = null;

  // Create form using CustomFormBuilder
  clientForm: FormGroup<FormControls<ClientFormModel>> =
    CustomFormBuilder.buildFormGroup(clientInitialModel, clientFormValidators);

  get dogsArray(): FormArray {
    return this.clientForm.get('dogs') as FormArray;
  }

  ngOnInit(): void {
    const client = this._route.snapshot.data['client'] as ClientDetailDto;
    if (client) {
      this.isEditMode.set(true);
      this.clientId = client.id;
      this.title.set(`Edit Client - ${client.firstName} ${client.lastName}`);
      this.clientForm.patchValue(client);
      if (client.dogs && client.dogs.length > 0) {
        client.dogs.forEach((dog) => {
          // Include the ID to track existing dogs
          const dogFormModel = { ...dog, id: dog.id };
          const dogGroup = CustomFormBuilder.buildFormGroup(
            dogFormModel,
            dogFormValidators,
          );
          this.dogsArray.push(dogGroup);
        });
      }
    }
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
    this._clientsService.createClient(clientRequest).subscribe({
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
            return this._dogsService.createDog(dogRequest);
          });

          // Create all dogs in parallel
          forkJoin(dogRequests).subscribe({
            next: () => {
              this.isLoading.set(false);
              this._router.navigate(['/clients']);
            },
            error: (error) => {
              this.isLoading.set(false);
              const message =
                'Client created, but there was an error creating the dogs: ' +
                (error.error?.message || error.message);
              this.errorMessage.set(message);
              this._snackbar.error(message);
            },
          });
        } else {
          // No dogs to create, just navigate
          this.isLoading.set(false);
          this._router.navigate(['/clients']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message || 'Error creating client';
        this.errorMessage.set(message);
        this._snackbar.error(message);
      },
    });
  }

  updateClient(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const clientId = this.clientId || this._route.snapshot.data['client'].id;
    const client = this.clientForm.value as ClientFormModel;

    const clientUpdateRequest: ClientCreateRequest = {
      firstName: client.firstName!,
      lastName: client.lastName!,
      email: client.email!,
      phone: client.phone!,
      addressLine1: client.addressLine1 || undefined,
      city: client.city || undefined,
      state: client.state || undefined,
      zip: client.zip || undefined,
    };

    this._clientsService.updateClient(clientId, clientUpdateRequest).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.errorMessage.set(null);
        this._snackbar.success('Client updated successfully!');
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message || 'Error updating client';
        this.errorMessage.set(message);
        this._snackbar.error(message);
      },
    });
  }

  updateDog(index: number): void {
    const dogGroup = this.dogsArray.at(index);
    if (dogGroup.invalid) {
      dogGroup.markAllAsTouched();
      return;
    }

    this.loadingDogIndex.set(index);
    this.errorMessage.set(null);

    const dog = dogGroup.value as DogFormModel;
    const clientId = this.clientId || this._route.snapshot.data['client'].id;

    // Check if it's an existing dog (has ID) or a new one
    if (dog.id) {
      // Update existing dog
      const dogUpdateRequest: DogUpdateRequest = {
        clientId: clientId,
        name: dog.name!,
        breed: dog.breed!,
        birthDate: dog.birthDate || undefined,
        notes: dog.notes || undefined,
        isActive: dog.isActive!,
      };

      this._dogsService.updateDog(dog.id, dogUpdateRequest).subscribe({
        next: () => {
          this.loadingDogIndex.set(null);
          this._snackbar.success(`Dog "${dog.name}" updated successfully!`);
        },
        error: (error) => {
          this.loadingDogIndex.set(null);
          const message =
            error.error?.message || `Error updating dog "${dog.name}"`;
          this.errorMessage.set(message);
          this._snackbar.error(message);
        },
      });
    } else {
      // Create new dog
      const dogCreateRequest: DogCreateRequest = {
        clientId: clientId,
        name: dog.name!,
        breed: dog.breed!,
        birthDate: dog.birthDate || undefined,
        notes: dog.notes || undefined,
        isActive: dog.isActive!,
      };

      this._dogsService.createDog(dogCreateRequest).subscribe({
        next: (response) => {
          this.loadingDogIndex.set(null);
          // Update the form with the new ID so subsequent saves will be updates
          dogGroup.patchValue({ id: response.id });
          this._snackbar.success(`Dog "${dog.name}" added successfully!`);
        },
        error: (error) => {
          this.loadingDogIndex.set(null);
          const message =
            error.error?.message || `Error creating dog "${dog.name}"`;
          this.errorMessage.set(message);
          this._snackbar.error(message);
        },
      });
    }
  }

  deleteDog(index: number): void {
    const dogGroup = this.dogsArray.at(index);
    const dog = dogGroup.value as DogFormModel;

    if (!dog.id) {
      // Just remove from form if it wasn't saved yet
      this.removeDog(index);
      return;
    }

    // Open confirmation dialog
    const dialogRef = this._confirmationService.open({
      title: 'Delete Dog',
      message: `Are you sure you want to delete "${dog.name}"? This action cannot be undone.`,
      icon: {
        show: true,
        name: 'heroicons_outline:exclamation-triangle',
        color: 'warn',
      },
      actions: {
        confirm: {
          show: true,
          label: 'Delete',
          color: 'warn',
        },
        cancel: {
          show: true,
          label: 'Cancel',
        },
      },
    });

    // Subscribe to afterClosed to get the result
    dialogRef.afterClosed().subscribe((result) => {
      // If confirmed, proceed with deletion
      if (result === 'confirmed') {
        this.loadingDogIndex.set(index);
        this.errorMessage.set(null);

        this._dogsService.deleteDog(dog.id!).subscribe({
          next: () => {
            this.loadingDogIndex.set(null);
            this.removeDog(index);
            this._snackbar.success(`Dog "${dog.name}" deleted successfully!`);
          },
          error: (error) => {
            this.loadingDogIndex.set(null);
            const message =
              error.error?.message || `Error deleting dog "${dog.name}"`;
            this.errorMessage.set(message);
            this._snackbar.error(message);
          },
        });
      }
    });
  }

  isDogLoading(index: number): boolean {
    return this.loadingDogIndex() === index;
  }

  onCancel(): void {
    this._router.navigate(['/clients']);
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
