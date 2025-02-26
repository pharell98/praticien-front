import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PraticienFormComponent } from '../../components/praticien-form/praticien-form.component';
import { PraticienListComponent } from '../../components/praticien-list/praticien-list.component';
import { ApiService } from '../../services/api.service';
import { log } from 'node:console';
export interface Praticien {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialites: string[];
  office: boolean;
  officiel: boolean;
  home: boolean;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, PraticienFormComponent, PraticienListComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  constructor(private apiService : ApiService){}
  // Correction du typage explicite du signal
  praticiens: WritableSignal<Praticien[]> = signal<Praticien[]>([]);

  addPraticien(praticien: Praticien) {

    this.praticiens.set([...this.praticiens(), praticien]);
  }
  users = Array([]);
  loadPraticien(){
    this.apiService.get<{ data: any[] }>('users').subscribe(
      response => {
        this.users = response.data; 
        console.log(this.users);
      },
      error => {
        console.error('Erreur de récupération des transactions:', error);
      }
    );
  }
  ngOnInit() {
    this.loadPraticien();
  }
}
