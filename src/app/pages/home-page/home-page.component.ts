// home-page.component.ts
import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { PraticienFormComponent } from '../../components/praticien-form/praticien-form.component';
import { PraticienListComponent } from '../../components/praticien-list/praticien-list.component';
import { ApiService } from '../../services/api.service';

export interface Praticien {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialites: any[];
  adresses?: { adresse: string; type: string }[];
  office: boolean;
  officiel: boolean;
  home: boolean;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatChipsModule, PraticienFormComponent, PraticienListComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  constructor(private apiService: ApiService) {}

  // Signal pour stocker la liste des praticiens
  praticiens: WritableSignal<Praticien[]> = signal<Praticien[]>([]);

  // Stocke la liste des spécialités récupérées depuis l'API
  specialites: string[] = [];

  // Stocke le praticien à modifier (mode modification)
  praticienToEdit: Praticien | null = null;

  addPraticien(praticien: Praticien): void {
    if (this.praticienToEdit) {
      // Mode modification : appel PUT
      this.apiService.updatePraticien<{ data: any }>(praticien, this.praticienToEdit.id).subscribe(
        response => {
          console.log("Praticien mis à jour :", response.data);
          this.praticiens.set(
            this.praticiens().map(p => p.id === this.praticienToEdit!.id ? response.data : p)
          );
          this.praticienToEdit = null;
        },
        error => {
          console.error("Erreur lors de la mise à jour du praticien :", error);
        }
      );
    } else {
      // Mode ajout : appel POST
      this.apiService.postPraticien<{ data: any }>(praticien).subscribe(
        response => {
          console.log("Praticien ajouté :", response.data);
          this.praticiens.set([...this.praticiens(), response.data]);
        },
        error => {
          console.error("Erreur lors de l'ajout du praticien :", error);
        }
      );
    }
  }

  onEditPraticien(praticien: Praticien): void {
    this.praticienToEdit = praticien;
  }

  loadSpecialites(): void {
    this.apiService.getSpecialites<{ data: any[] }>().subscribe(
      response => {
        // Conserver uniquement le nom de chaque spécialité
        this.specialites = response.data.map(item => item.nom);
        console.log("Liste des spécialités :", this.specialites);
      },
      error => {
        console.error('Erreur de récupération des spécialités:', error);
      }
    );
  }

  loadPraticiens(): void {
    this.apiService.getPraticiens<{ data: any[] }>().subscribe(
      response => {
        this.praticiens.set(response.data);
        console.log("Liste des praticiens :", response.data);
      },
      error => {
        console.error('Erreur de récupération des praticiens:', error);
      }
    );
  }

  onPraticienDeleted(id: string): void {
    this.praticiens.set(this.praticiens().filter(p => p.id !== id));
  }

  ngOnInit(): void {
    this.loadSpecialites();
    this.loadPraticiens();
  }
}
