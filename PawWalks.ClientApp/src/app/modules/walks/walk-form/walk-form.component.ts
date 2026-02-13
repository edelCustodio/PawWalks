import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import {
  CustomFormBuilder,
  FormControls,
} from '../../../utils/reactive-form.utils';
import { FormGroup } from '@angular/forms';
import {
  WalkFormModel,
  walkInitialModel,
  walkFormValidators,
  WalkCreateRequest,
} from '../models/walks.model';
import { WalksService } from '../services/walks.service';
import { DogsService } from '../../dogs/services/dogs.service';
import { ClientsService } from '../../clients/services/clients.service';
import { SnackbarService } from '../../../core/services/snack-bar.service';
import { DogDetailDto } from '../../dogs/models/dogs.model';
import { ClientDetailDto } from '../../clients/models/clients.model';

interface SelectedDog extends DogDetailDto {
  clientName: string;
  clientId: string;
}

@Component({
  selector: 'app-walk-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatChipsModule,
  ],
  templateUrl: './walk-form.component.html',
  styleUrl: './walk-form.component.scss',
})
export class WalkFormComponent implements OnInit {
  private _walksService = inject(WalksService);
  private _clientsService = inject(ClientsService);
  private _snackbar = inject(SnackbarService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  // Loading states
  isLoading = signal(false);
  isLoadingClients = signal(true);
  isLoadingClientDogs = signal(false);

  // Data
  allClients = signal<ClientDetailDto[]>([]);
  selectedClientId = signal<string | null>(null);
  availableDogsForSelectedClient = signal<DogDetailDto[]>([]);
  selectedDogsForWalk = signal<SelectedDog[]>([]);

  // Computed
  selectedClient = computed(() => {
    const clientId = this.selectedClientId();
    if (!clientId) return null;
    return this.allClients().find((c) => c.id === clientId) || null;
  });

  hasSelectedDogs = computed(() => this.selectedDogsForWalk().length > 0);

  minDate = new Date();
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  form: FormGroup<FormControls<WalkFormModel>> =
    CustomFormBuilder.buildFormGroup<WalkFormModel>(
      {
        ...walkInitialModel,
        startDate: new Date(),
        startTime: this.getDefaultTime(),
      },
      walkFormValidators,
    );

  ngOnInit() {
    this.loadAllClients();
  }

  private loadAllClients() {
    this.isLoadingClients.set(true);

    this._clientsService.getClients(1, 100).subscribe({
      next: (result) => {
        this.allClients.set(result.items);
        this.isLoadingClients.set(false);
      },
      error: (error) => {
        this.isLoadingClients.set(false);
        this._snackbar.error('Error loading clients');
        console.error('Error loading clients:', error);
      },
    });
  }

  onClientSelected(clientId: string) {
    this.selectedClientId.set(clientId);
    this.loadDogsForClient(clientId);
  }

  private loadDogsForClient(clientId: string) {
    this.isLoadingClientDogs.set(true);

    this._clientsService.getClientById(clientId).subscribe({
      next: (client) => {
        // Filter only active dogs that are not already added
        const activeDogs = client.dogs.filter(
          (dog) =>
            dog.isActive &&
            !this.selectedDogsForWalk().some(
              (selected) => selected.id === dog.id,
            ),
        );
        this.availableDogsForSelectedClient.set(activeDogs);
        this.isLoadingClientDogs.set(false);
      },
      error: (error) => {
        this.isLoadingClientDogs.set(false);
        this._snackbar.error('Error loading dogs for client');
        console.error('Error loading dogs:', error);
      },
    });
  }

  addDogToWalk(dog: DogDetailDto) {
    const client = this.selectedClient();
    if (!client) return;

    const selectedDog: SelectedDog = {
      ...dog,
      clientName: `${client.firstName} ${client.lastName}`,
      clientId: client.id,
    };

    // Update selected dogs
    const updatedDogs = [...this.selectedDogsForWalk(), selectedDog];
    this.selectedDogsForWalk.set(updatedDogs);

    // Remove from available dogs
    this.availableDogsForSelectedClient.update((dogs) =>
      dogs.filter((d) => d.id !== dog.id),
    );
  }

  removeDogFromWalk(dog: SelectedDog) {
    // Update selected dogs
    const updatedDogs = this.selectedDogsForWalk().filter(
      (d) => d.id !== dog.id,
    );
    this.selectedDogsForWalk.set(updatedDogs);

    // If the removed dog's client is currently selected, add it back to available
    if (this.selectedClientId() === dog.clientId) {
      this.availableDogsForSelectedClient.update((dogs) => [...dogs, dog]);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._snackbar.warning('Please fix the form errors');
      return;
    }

    const formValue = this.form.value;

    // Combine date and time into ISO string
    const startAtISO = this.combineDateAndTime(
      formValue.startDate!,
      formValue.startTime!,
    );

    // Get dogIds from the signal, not from form
    const dogIds = this.selectedDogsForWalk().map((d) => d.id);

    const request: WalkCreateRequest = {
      startAt: startAtISO,
      durationMinutes: formValue.durationMinutes!,
      notes: formValue.notes || undefined,
      dogIds: dogIds,
    };

    this.isLoading.set(true);

    this._walksService.createWalk(request).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this._snackbar.success('Walk scheduled successfully!');
        this._router.navigate(['/walks']);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message || 'Error scheduling walk';
        this._snackbar.error(message);
        console.error('Error creating walk:', error);
      },
    });
  }

  cancel() {
    this._router.navigate(['/walks']);
  }

  private getDefaultTime(): string {
    // Round to next hour
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    return `${now.getHours().toString().padStart(2, '0')}:00`;
  }

  private combineDateAndTime(date: Date | string, time: string): string {
    let dateStr: string;

    if (date instanceof Date) {
      // Convert Date object to YYYY-MM-DD format
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    } else {
      dateStr = date;
    }

    return `${dateStr}T${time}:00`;
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    return `${hours}h ${mins}m`;
  }

  hasDogsFromClient(clientId: string): boolean {
    return this.selectedDogsForWalk().some((dog) => dog.clientId === clientId);
  }
}
