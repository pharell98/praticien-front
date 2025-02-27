// praticien-form.component.ts
import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatChipGrid, MatChipRow } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'praticien-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatChipGrid, MatChipRow,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './praticien-form.component.html',
  styleUrls: ['./praticien-form.component.css']
})
export class PraticienFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

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

  // La liste des spécialités récupérées depuis l'API
  specialites: string[] = [];

  // Liste des spécialités sélectionnées par l'utilisateur
  selectedSpecialites: string[] = [];

  // Contrôle pour l'autocomplétion
  specialiteCtrl = this.fb.control('');

  // Les séparateurs autorisés (Enter, virgule)
  separatorKeysCodes: number[] = [ENTER, COMMA];

  // Observable pour filtrer les spécialités disponibles
  filteredSpecialites: Observable<string[]> = this.specialiteCtrl.valueChanges.pipe(
    startWith(''),
    map(value => this.filterSpecialites(value || ''))
  );

  ngOnInit(): void {
    // Récupération des spécialités depuis l'API
    this.apiService.getSpecialites<{ data: any[] }>().subscribe(
      response => {
        // Conserver uniquement le nom de chaque spécialité
        this.specialites = response.data.map(item => item.nom);
        console.log('Spécialités récupérées:', this.specialites);
        // Forcer la réévaluation du filtre pour mettre à jour l'autocomplétion
        this.specialiteCtrl.setValue(this.specialiteCtrl.value);
      },
      error => {
        console.error('Erreur lors de la récupération des spécialités:', error);
      }
    );
  }

  private filterSpecialites(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.specialites.filter(specialite =>
      specialite.toLowerCase().includes(filterValue) && !this.selectedSpecialites.includes(specialite)
    );
  }

  // Ajoute une spécialité tapée dans l'input
  add(event: any) {
    const value = (event.value || '').trim();
    if (value && !this.selectedSpecialites.includes(value)) {
      this.selectedSpecialites.push(value);
    }
    event.chipInput!.clear();
    this.specialiteCtrl.setValue('');
  }

  // Ajoute une spécialité sélectionnée dans l'autocomplete
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
      const formValue = this.praticienForm.value;
      // Construction des adresses à partir des cases cochées (avec valeurs par défaut)
      const adresses = [];
      if (formValue.office) { adresses.push({ adresse: "123 Rue de Paris", type: "OFFICE" }); }
      if (formValue.home) { adresses.push({ adresse: "456 Rue de Lyon", type: "HOME" }); }
      if (formValue.officiel) { adresses.push({ adresse: "Adresse Officiel par défaut", type: "OFFICIEL" }); }

      const data = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        email: formValue.email,
        telephone: formValue.telephone,
        adresses: adresses,
        specialites: this.selectedSpecialites
      };

      // On émet l'objet formé (le parent pourra alors appeler le service POST)
      this.addPraticien.emit(data);
      this.praticienForm.reset();
      this.selectedSpecialites = [];
    }
  }
}
