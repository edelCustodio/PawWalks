// Base interfaces matching backend DTOs

import { Validators } from '@angular/forms';
import { DogFormModel, DogListItemDto } from '../../dogs/models/dogs.model';

export interface ClientCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface ClientUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface ClientListItemDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface ClientDetailDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
  createdAt: string;
  updatedAt: string;
  dogs: DogListItemDto[];
}

// Form models (for internal use with reactive forms)
export interface ClientFormModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  dogs: DogFormModel[];
}

// Initial form model
export const clientInitialModel: ClientFormModel = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  zip: '',
  dogs: [],
};

export const clientFormValidators = {
  firstName: {
    validators: [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ],
  },
  lastName: {
    validators: [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ],
  },
  email: {
    validators: [
      Validators.required,
      Validators.email,
      Validators.maxLength(255),
    ],
  },
  phone: {
    validators: [
      Validators.required,
      Validators.pattern(/^[\d\s\-\(\)\+]+$/),
      Validators.maxLength(20),
    ],
  },
  addressLine1: {
    validators: [Validators.maxLength(255)],
  },
  city: {
    validators: [Validators.maxLength(100)],
  },
  state: {
    validators: [Validators.maxLength(50)],
  },
  zip: {
    validators: [Validators.maxLength(10)],
  },
  dogs: {
    itemValidators: {
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
    },
  },
};
