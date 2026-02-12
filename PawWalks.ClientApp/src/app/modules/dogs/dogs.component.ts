import { Component } from '@angular/core';

@Component({
  selector: 'app-dogs',
  standalone: true,
  template: `
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Perros</h1>
      <p class="text-gray-600">Lista de perros - En desarrollo</p>
    </div>
  `,
})
export class DogsComponent {}
