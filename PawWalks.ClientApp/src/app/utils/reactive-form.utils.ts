import {
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';

export interface ValidatorConfig {
  validators?: ValidatorFn | ValidatorFn[] | null;
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
  itemValidators?: ValidatorsOf<any>;
  disabled?: boolean;
}

export type FormControls<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? U extends object
      ? FormArray<FormGroup<FormControls<U>>>
      : FormArray<FormControl<U>>
    : T[K] extends object
      ? FormGroup<FormControls<T[K]>>
      : FormControl<T[K]>;
};

export type ValidatorsOf<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? ValidatorConfig & {
        itemValidators?: ValidatorsOf<U>;
      }
    : T[K] extends object
      ? ValidatorConfig & {
          children?: ValidatorsOf<T[K]>;
        }
      : ValidatorConfig;
};

export class CustomFormBuilder {
  static buildFormGroup<T>(
    model: T,
    validators?: ValidatorsOf<T>,
  ): FormGroup<FormControls<T>> {
    const controls = {} as FormControls<T>;

    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        const value = model[key];
        const validatorForKey = validators && validators[key];

        if (Array.isArray(value)) {
          const itemValidators =
            validatorForKey && validatorForKey.itemValidators;
          const arrayControls = value.map((item) => {
            if (typeof item === 'object' && item !== null) {
              return CustomFormBuilder.buildFormGroup(item, itemValidators);
            } else {
              return new FormControl(
                item,
                itemValidators?.['validators'] ||
                  itemValidators?.['asyncValidators'] ||
                  null,
              );
            }
          });

          controls[key] = new FormArray(arrayControls, {
            validators: validatorForKey?.validators || null,
            asyncValidators: validatorForKey?.asyncValidators || null,
          }) as any;
        } else if (
          typeof value === 'object' &&
          value !== null &&
          !(value instanceof Date)
        ) {
          controls[key] = CustomFormBuilder.buildFormGroup(
            value,
            validatorForKey && 'children' in validatorForKey
              ? validatorForKey.children
              : undefined,
          ) as any;

          if (validatorForKey) {
            (controls[key] as FormGroup).setValidators(
              validatorForKey.validators || null,
            );
            (controls[key] as FormGroup).setAsyncValidators(
              validatorForKey.asyncValidators || null,
            );
          }
        } else {
          controls[key] = new FormControl(
            {
              value: value,
              disabled: validatorForKey?.disabled || false,
            },
            {
              validators: validatorForKey?.validators || null,
              asyncValidators: validatorForKey?.asyncValidators || null,
            },
          ) as any;
        }
      }
    }

    const groupValidators = (validators as ValidatorConfig)?.validators;
    const groupAsyncValidators = (validators as ValidatorConfig)
      ?.asyncValidators;

    return new FormGroup<FormControls<T>>(controls, {
      validators: groupValidators || null,
      asyncValidators: groupAsyncValidators || null,
    });
  }
}
