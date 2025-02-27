// praticien-form.component.ts
import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
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
import { Praticien } from '../../pages/home-page/home-page.component';

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
export class PraticienFormComponent implements OnInit, OnChanges {
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

  // Input pour recevoir un praticien à modifier
  @Input() praticienToEdit: Praticien | null = null;

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
        this.specialites = response.data.map(item => item.nom);
        console.log('Spécialités récupérées:', this.specialites);
        this.specialiteCtrl.setValue(this.specialiteCtrl.value);
      },
      error => {
        console.error('Erreur lors de la récupération des spécialités:', error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['praticienToEdit'] && this.praticienToEdit) {
      // Pré-remplissage du formulaire avec les données du praticien à modifier
      this.praticienForm.patchValue({
        nom: this.praticienToEdit.nom,
        prenom: this.praticienToEdit.prenom,
        email: this.praticienToEdit.email,
        telephone: this.praticienToEdit.telephone,
        office: this.praticienToEdit.office,
        officiel: this.praticienToEdit.officiel,
        home: this.praticienToEdit.home
      });
      // Pour les spécialités, on suppose ici que c'est un tableau de chaînes
      this.selectedSpecialites = [...this.praticienToEdit.specialites.map((s: any) => s.nom || s)];
    }
  }

  private filterSpecialites(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.specialites.filter(specialite =>
      specialite.toLowerCase().includes(filterValue) && !this.selectedSpecialites.includes(specialite)
    );
  }

  add(event: any) {
    const value = (event.value || '').trim();
    if (value && !this.selectedSpecialites.includes(value)) {
      this.selectedSpecialites.push(value);
    }
    event.chipInput!.clear();
    this.specialiteCtrl.setValue('');
  }

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

      this.addPraticien.emit(data);
      this.praticienForm.reset();
      this.selectedSpecialites = [];
    }
  }
}
