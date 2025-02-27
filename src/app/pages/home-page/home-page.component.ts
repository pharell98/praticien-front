import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal, WritableSignal } from '@angular/core';
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
export class HomePageComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  praticiens: WritableSignal<Praticien[]> = signal<Praticien[]>([]);
  specialites: string[] = [];
  praticienToEdit: Praticien | null = null;

  addPraticien(praticien: Praticien): void {
    if (this.praticienToEdit) {
      this.apiService.updatePraticien<{ data: any }>(praticien, this.praticienToEdit.id).subscribe(
        response => {
          this.praticiens.set(
            this.praticiens().map(p => p.id === this.praticienToEdit!.id ? response.data : p)
          );
          this.praticienToEdit = null;
        },
        error => {
        }
      );
    } else {
      this.apiService.postPraticien<{ data: any }>(praticien).subscribe(
        response => {
          this.praticiens.set([...this.praticiens(), response.data]);
        },
        error => {
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
        this.specialites = response.data.map(item => item.nom);
      },
      error => {
      }
    );
  }

  loadPraticiens(): void {
    this.apiService.getPraticiens<{ data: any[] }>().subscribe(
      response => {
        this.praticiens.set(response.data);
      },
      error => {
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
