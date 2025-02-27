// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // La base URL s'arrête à /api/v1/
  private baseUrl = 'http://localhost:8080/api/v1/';

  constructor(private http: HttpClient) {}

  // Retourne des en-têtes (ici sans authentification)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  // Récupère la liste des spécialités
  getSpecialites<T>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}specialites`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log("Réponse des spécialités :", response)),
        catchError((error) => {
          console.error("Erreur lors de la requête GET des spécialités :", error);
          return throwError(() => error);
        })
      );
  }

  // Récupère la liste des praticiens
  getPraticiens<T>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}praticiens`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log("Réponse des praticiens :", response)),
        catchError((error) => {
          console.error("Erreur lors de la requête GET des praticiens :", error);
          return throwError(() => error);
        })
      );
  }
}
