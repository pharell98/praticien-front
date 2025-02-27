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

  // Retourne des en-têtes (sans authentification)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  // GET : Récupère la liste des spécialités
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

  // GET : Récupère la liste des praticiens
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

  // POST : Ajoute un praticien
  postPraticien<T>(data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}praticiens`, data, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log("Réponse post praticien :", response)),
        catchError((error) => {
          console.error("Erreur lors de la requête POST des praticiens :", error);
          return throwError(() => error);
        })
      );
  }
}
