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
  @Output() editPraticien = new EventEmitter<Praticien>();

  private apiService = inject(ApiService);

  hasAddress(adresses: { type: string }[] | undefined, type: string): boolean {
    return (adresses || []).some(ad => ad.type === type);
  }

  edit(praticien: Praticien): void {
    this.editPraticien.emit(praticien);
  }

  deletePraticien(praticien: Praticien): void {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce praticien ?')) {
      this.apiService.deletePraticien(praticien.id).subscribe(
        response => {
          this.praticienDeleted.emit(praticien.id);
        },
        error => {
        }
      );
    }
  }
}
