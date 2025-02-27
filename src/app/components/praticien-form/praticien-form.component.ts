import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  @Input() praticienToEdit: Praticien | null = null;
  @Input() specialites: string[] = [];

  selectedSpecialites: string[] = [];
  specialiteCtrl = this.fb.control('');
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredSpecialites: Observable<string[]> = this.specialiteCtrl.valueChanges.pipe(
    startWith(''),
    map(value => this.filterSpecialites(value || ''))
  );

  ngOnInit(): void {
    this.specialiteCtrl.setValue(this.specialiteCtrl.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['praticienToEdit'] && this.praticienToEdit) {
      const adresses = this.praticienToEdit.adresses || [];
      const hasOffice = adresses.some(ad => ad.type === 'OFFICE');
      const hasHome = adresses.some(ad => ad.type === 'HOME');
      const hasOfficiel = adresses.some(ad => ad.type === 'OFFICIEL');

      this.praticienForm.patchValue({
        nom: this.praticienToEdit.nom,
        prenom: this.praticienToEdit.prenom,
        email: this.praticienToEdit.email,
        telephone: this.praticienToEdit.telephone,
        office: hasOffice,
        officiel: hasOfficiel,
        home: hasHome
      });

      this.selectedSpecialites = this.praticienToEdit.specialites.map(s => s.nom || s);
    }
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

  add(event: any): void {
    const value = (event.value || '').trim();
    if (value && !this.selectedSpecialites.includes(value)) {
      this.selectedSpecialites.push(value);
    }
    event.chipInput?.clear();
    this.specialiteCtrl.setValue('');
  }

  selected(event: any): void {
    const specialite = event.option.viewValue;
    if (specialite && !this.selectedSpecialites.includes(specialite)) {
      this.selectedSpecialites.push(specialite);
    }
    this.specialiteCtrl.setValue('');
  }

  removeSpecialite(specialite: string): void {
    const index = this.selectedSpecialites.indexOf(specialite);
    if (index >= 0) {
      this.selectedSpecialites.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.praticienForm.valid) {
      const formValue = this.praticienForm.value;

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
