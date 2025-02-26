import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Praticien } from '../../pages/home-page/home-page.component';

@Component({
  selector: 'praticien-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './praticien-list.component.html',
  styleUrls: ['./praticien-list.component.css']
})
export class PraticienListComponent {
  @Input() praticiens: Praticien[] = [];

  // Méthode pour l'édition
  editPraticien(praticien: Praticien): void {
    console.log('Modification du praticien : ', praticien);
    // Ajoutez ici votre logique de modification
  }

  // Méthode pour la suppression
  deletePraticien(praticien: Praticien): void {
    console.log('Suppression du praticien : ', praticien);
    // Ajoutez ici votre logique de suppression
  }
}
