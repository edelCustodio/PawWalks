import { Validators } from '@angular/forms';

export interface DogCreateRequest {
  clientId: string;
  name: string;
  breed: string;
  birthDate?: string; // ISO date string (YYYY-MM-DD)
  notes?: string;
  isActive: boolean;
}

export interface DogUpdateRequest {
  clientId: string;
  name: string;
  breed: string;
  birthDate?: string;
  notes?: string;
  isActive: boolean;
}

export interface DogDetailDto {
  id: string;
  clientId: string;
  name: string;
  breed: string;
  birthDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
}

export interface DogFormModel {
  id?: string; // For tracking existing dogs in edit mode
  name: string;
  breed: string;
  birthDate: string; // Will use date input
  notes: string;
  isActive: boolean;
}

export const dogInitialModel: DogFormModel = {
  id: undefined,
  name: '',
  breed: '',
  birthDate: '',
  notes: '',
  isActive: true,
};

export const dogFormValidators = {
  name: {
    validators: [Validators.required, Validators.maxLength(100)],
  },
  breed: {
    validators: [Validators.required, Validators.maxLength(100)],
  },
  birthDate: {},
  notes: {
    validators: [Validators.maxLength(500)],
  },
  isActive: {},
};
