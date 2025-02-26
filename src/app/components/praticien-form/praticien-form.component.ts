import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips'; // ✅ Import du module
import { MatChipGrid, MatChipRow } from '@angular/material/chips'; // ✅ Ajout du Grid et Row
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'praticien-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule, // ✅ Assurez-vous qu'il est bien ajouté ici
    MatChipGrid, MatChipRow, // ✅ Ajout du Grid et Row pour `mat-chip-grid`
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './praticien-form.component.html',
  styleUrls: ['./praticien-form.component.css']
})
export class PraticienFormComponent {
  private fb = inject(FormBuilder);

  praticienForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    office: false,
    officiel: false,
    home: false
  });

  @Output() addPraticien = new EventEmitter<any>();

  // Liste des spécialités disponibles
  specialites: string[] = ['Cardiologie', 'Dentiste', 'Généraliste', 'Ophtalmologie', 'Neurologie'];

  // Liste des spécialités sélectionnées
  selectedSpecialites: string[] = [];

  // Contrôle pour l'autocomplétion
  specialiteCtrl = this.fb.control('');

  // Observable pour filtrer les spécialités
  filteredSpecialites: Observable<string[]> = this.specialiteCtrl.valueChanges.pipe(
    startWith(''),
    map(value => this.filterSpecialites(value || ''))
  );

  // Séparateurs autorisés pour ajouter une spécialité (Enter, virgule)
  separatorKeysCodes: number[] = [ENTER, COMMA];

  private filterSpecialites(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.specialites.filter(specialite =>
      specialite.toLowerCase().includes(filterValue) && !this.selectedSpecialites.includes(specialite)
    );
  }

  // ✅ Correction de `add()`
  add(event: any) {
    const value = (event.value || '').trim();
    if (value && !this.selectedSpecialites.includes(value)) {
      this.selectedSpecialites.push(value);
    }
    event.chipInput!.clear();
    this.specialiteCtrl.setValue('');
  }

  // ✅ Correction de `selected()`
  selected(event: any) {
    const specialite = event.option.viewValue;
    if (specialite && !this.selectedSpecialites.includes(specialite)) {
      this.selectedSpecialites.push(specialite);
    }
    this.specialiteCtrl.setValue('');
  }

  removeSpecialite(specialite: string) {
    const index = this.selectedSpecialites.indexOf(specialite);
    if (index >= 0) {
      this.selectedSpecialites.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.praticienForm.valid) {
      this.addPraticien.emit({
        ...this.praticienForm.value,
        specialites: this.selectedSpecialites
      });
      this.praticienForm.reset();
      this.selectedSpecialites = [];
    }
  }
}
