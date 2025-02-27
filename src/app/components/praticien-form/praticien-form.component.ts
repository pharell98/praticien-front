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

  // Notre formulaire, avec des booléens pour les adresses
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

  // Praticien à modifier (mode édition)
  @Input() praticienToEdit: Praticien | null = null;

  // Liste des spécialités passées par le parent
  @Input() specialites: string[] = [];

  // Liste des spécialités sélectionnées (pour l'autocomplétion + chips)
  selectedSpecialites: string[] = [];

  // Contrôle pour l'autocomplétion
  specialiteCtrl = this.fb.control('');

  // Séparateurs autorisés (Enter, virgule)
  separatorKeysCodes: number[] = [ENTER, COMMA];

  // Observable pour filtrer les spécialités
  filteredSpecialites: Observable<string[]> = this.specialiteCtrl.valueChanges.pipe(
    startWith(''),
    map(value => this.filterSpecialites(value || ''))
  );

  ngOnInit(): void {
    // On force la mise à jour du filtre lors de l'initialisation
    this.specialiteCtrl.setValue(this.specialiteCtrl.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si on passe en mode édition (praticienToEdit défini)
    if (changes['praticienToEdit'] && this.praticienToEdit) {
      // Extraire le tableau d'adresses
      const adresses = this.praticienToEdit.adresses || [];
      // Vérifier la présence de chaque type
      const hasOffice = adresses.some(ad => ad.type === 'OFFICE');
      const hasHome = adresses.some(ad => ad.type === 'HOME');
      const hasOfficiel = adresses.some(ad => ad.type === 'OFFICIEL');

      // Pré-remplir le formulaire
      this.praticienForm.patchValue({
        nom: this.praticienToEdit.nom,
        prenom: this.praticienToEdit.prenom,
        email: this.praticienToEdit.email,
        telephone: this.praticienToEdit.telephone,
        office: hasOffice,
        officiel: hasOfficiel,
        home: hasHome
      });

      // Gérer les spécialités (ex. si c'est un tableau d'objets { nom: "..." })
      this.selectedSpecialites = this.praticienToEdit.specialites.map(s => s.nom || s);
    }

    // Si la liste des spécialités a changé, on relance le filtre
    if (changes['specialites']) {
      this.specialiteCtrl.setValue(this.specialiteCtrl.value);
    }
  }

  private filterSpecialites(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.specialites.filter(specialite =>
      specialite.toLowerCase().includes(filterValue) &&
      !this.selectedSpecialites.includes(specialite)
    );
  }

  // Ajoute une spécialité via la saisie (tokenEnd)
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

  // Supprime une spécialité d'un chip
  removeSpecialite(specialite: string) {
    const index = this.selectedSpecialites.indexOf(specialite);
    if (index >= 0) {
      this.selectedSpecialites.splice(index, 1);
    }
  }

  // Soumission du formulaire (ajout ou modification)
  onSubmit() {
    if (this.praticienForm.valid) {
      const formValue = this.praticienForm.value;

      // Construction du tableau d'adresses en fonction des cases cochées
      const adresses = [];
      if (formValue.office) {
        adresses.push({ adresse: "123 Rue de Paris", type: "OFFICE" });
      }
      if (formValue.home) {
        adresses.push({ adresse: "456 Rue de Lyon", type: "HOME" });
      }
      if (formValue.officiel) {
        adresses.push({ adresse: "Adresse Officiel par défaut", type: "OFFICIEL" });
      }

      // On émet l'objet complet
      const data = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        email: formValue.email,
        telephone: formValue.telephone,
        adresses: adresses,
        specialites: this.selectedSpecialites
      };

      this.addPraticien.emit(data);

      // Réinitialisation du formulaire et du tableau de spécialités
      this.praticienForm.reset();
      this.selectedSpecialites = [];
    }
  }
}
