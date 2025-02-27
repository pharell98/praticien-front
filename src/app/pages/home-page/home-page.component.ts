// home-page.component.ts
import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { PraticienFormComponent } from '../../components/praticien-form/praticien-form.component';
import { PraticienListComponent } from '../../components/praticien-list/praticien-list.component';
import { ApiService } from '../../services/api.service';

export interface Praticien {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialites: any[]; // Tableau d'objets { id, nom, description }
  adresses?: { type: string }[];
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

  // Optionnel : stockage des spécialités disponibles (pour le formulaire)
  specialites: any[] = [];

  addPraticien(praticien: Praticien): void {
    this.praticiens.set([...this.praticiens(), praticien]);
  }

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

  ngOnInit(): void {
    this.loadSpecialites();
    this.loadPraticiens();
  }
}
