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

export interface DogListItemDto {
  id: string;
  clientId: string;
  name: string;
  breed: string;
  isActive: boolean;
  clientName?: string;
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
  name: string;
  breed: string;
  birthDate: string; // Will use date input
  notes: string;
  isActive: boolean;
}

export const dogInitialModel: DogFormModel = {
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
