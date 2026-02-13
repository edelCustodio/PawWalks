import { Validators } from '@angular/forms';

/**
 * Walk status enum matching backend
 */
export enum WalkStatus {
  Scheduled = 1,
  Completed = 2,
  Cancelled = 3,
}

/**
 * Request DTO for creating a new walk
 */
export interface WalkCreateRequest {
  startAt: string; // ISO date string
  durationMinutes: number;
  notes?: string;
  dogIds: string[];
}

/**
 * Request DTO for updating a walk
 */
export interface WalkUpdateRequest {
  startAt: string;
  durationMinutes: number;
  notes?: string;
  dogIds: string[];
  status: WalkStatus;
}

/**
 * Detailed walk information
 */
export interface WalkDetailDto {
  id: string;
  startAt: string;
  durationMinutes: number;
  notes?: string;
  status: WalkStatus;
  createdAt: string;
  updatedAt: string;
  dogs: WalkDogDto[];
}

/**
 * Walk list item for grid display
 */
export interface WalkListItemDto {
  id: string;
  startAt: string;
  durationMinutes: number;
  status: WalkStatus;
  dogCount: number;
  clientNames: string[];
}

/**
 * Dog information in walk context
 */
export interface WalkDogDto {
  id: string;
  name: string;
  breed: string;
  clientId: string;
  clientName: string;
}

/**
 * Form model for reactive forms
 */
export interface WalkFormModel {
  startDate: Date | string; // Date object from Material Datepicker or string (YYYY-MM-DD)
  startTime: string; // Time portion (HH:mm)
  durationMinutes: number;
  notes: string;
  dogIds: string[];
}

/**
 * Initial form values
 */
export const walkInitialModel: WalkFormModel = {
  startDate: '',
  startTime: '',
  durationMinutes: 30,
  notes: '',
  dogIds: [],
};

/**
 * Form validators
 */
export const walkFormValidators = {
  startDate: {
    validators: [Validators.required],
  },
  startTime: {
    validators: [Validators.required],
  },
  durationMinutes: {
    validators: [Validators.required, Validators.min(10), Validators.max(240)],
  },
  notes: {
    validators: [Validators.maxLength(500)],
  },
  dogIds: {
    validators: [],
  },
};

/**
 * Helper to get status display text
 */
export function getWalkStatusText(status: WalkStatus): string {
  switch (status) {
    case WalkStatus.Scheduled:
      return 'Scheduled';
    case WalkStatus.Completed:
      return 'Completed';
    case WalkStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

/**
 * Helper to get status color class
 */
export function getWalkStatusColor(status: WalkStatus): string {
  switch (status) {
    case WalkStatus.Scheduled:
      return 'text-blue-600 bg-blue-100';
    case WalkStatus.Completed:
      return 'text-green-600 bg-green-100';
    case WalkStatus.Cancelled:
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}
