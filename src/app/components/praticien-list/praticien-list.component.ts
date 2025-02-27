// praticien-list.component.ts
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
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
  @Output() praticienDeleted = new EventEmitter<string>();

  private apiService = inject(ApiService);

  // Vérifie si un praticien possède une adresse d'un type donné.
  hasAddress(adresses: { type: string }[] | undefined, type: string): boolean {
    return (adresses || []).some(ad => ad.type === type);
  }

  // Méthode pour l'édition (inchangée)
  editPraticien(praticien: Praticien): void {
    console.log('Modification du praticien : ', praticien);
    // Ajoutez ici votre logique de modification
  }

  // Méthode pour la suppression avec confirmation et recharge
  deletePraticien(praticien: Praticien): void {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce praticien ?')) {
      this.apiService.deletePraticien(praticien.id).subscribe(
        response => {
          console.log("Praticien supprimé :", response);
          // Notifie le parent afin de recharger la liste des praticiens
          this.praticienDeleted.emit(praticien.id);
        },
        error => {
          console.error("Erreur lors de la suppression du praticien :", error);
        }
      );
    }
  }
}
