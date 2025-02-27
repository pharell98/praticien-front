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
  specialites: any[]; // Tableau d'objets { id, nom, description } ou un tableau de chaînes lors de l'ajout
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

  // Stocke éventuellement la liste des spécialités (pour le formulaire)
  specialites: any[] = [];

  // Ajoute un praticien via l'API, puis met à jour la liste localement
  addPraticien(praticien: Praticien): void {
    this.apiService.postPraticien<{ data: any }>(praticien).subscribe(
      response => {
        console.log("Praticien ajouté :", response.data);
        // Ajout local sans recharger toute la liste
        this.praticiens.set([...this.praticiens(), response.data]);
      },
      error => {
        console.error("Erreur lors de l'ajout du praticien :", error);
      }
    );
  }

  // Charge la liste des spécialités (pour le formulaire)
  loadSpecialites(): void {
    this.apiService.getSpecialites<{ data: any[] }>().subscribe(
      (response: { data: any[] }) => {
        this.specialites = response.data;
        console.log("Liste des spécialités :", this.specialites);
      },
      (error: any) => {
        console.error('Erreur de récupération des spécialités:', error);
      }
    );
  }

  // Charge la liste des praticiens depuis l'API
  loadPraticiens(): void {
    this.apiService.getPraticiens<{ data: any[] }>().subscribe(
      (response: { data: any[] }) => {
        this.praticiens.set(response.data);
        console.log("Liste des praticiens :", response.data);
      },
      (error: any) => {
        console.error('Erreur de récupération des praticiens:', error);
      }
    );
  }

  // Mise à jour locale après suppression d'un praticien
  onPraticienDeleted(id: string): void {
    this.praticiens.set(this.praticiens().filter(p => p.id !== id));
  }

  ngOnInit(): void {
    this.loadSpecialites();
    this.loadPraticiens();
  }
}
