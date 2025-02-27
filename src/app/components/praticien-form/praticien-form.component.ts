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

  // Input pour recevoir le praticien à modifier
  @Input() praticienToEdit: Praticien | null = null;

  // Input pour recevoir la liste des spécialités depuis le parent
  @Input() specialites: string[] = [];

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
    // On force la mise à jour du filtre lors de l'initialisation
    this.specialiteCtrl.setValue(this.specialiteCtrl.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si le praticien à modifier change, pré-remplir le formulaire
    if (changes['praticienToEdit'] && this.praticienToEdit) {
      this.praticienForm.patchValue({
        nom: this.praticienToEdit.nom,
        prenom: this.praticienToEdit.prenom,
        email: this.praticienToEdit.email,
        telephone: this.praticienToEdit.telephone,
        office: this.praticienToEdit.office,
        officiel: this.praticienToEdit.officiel,
        home: this.praticienToEdit.home
      });
      // On suppose ici que les spécialités sont un tableau d'objets avec propriété "nom"
      this.selectedSpecialites = this.praticienToEdit.specialites.map(s => s.nom || s);
    }
    // Si la liste des spécialités (Input) change, forcer la réévaluation du filtre
    if (changes['specialites']) {
      this.specialiteCtrl.setValue(this.specialiteCtrl.value);
    }
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
