// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { StorageService } from '../storage-services/storage.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api'; // URL de votre backend

  constructor(private http: HttpClient, private storageService: StorageService) {}

  // Récupère les en-têtes avec les tokens
  private getHeaders(): HttpHeaders {
    const token = this.storageService.getItem('token');
    console.log(token);
    
    const sessionToken = this.storageService.getItem('session_token') || '';
console.log(sessionToken);

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (sessionToken) {
      headers = headers.set('x-session-token', sessionToken);
    }

    return headers;
  }

  // Méthode GET avec en-têtes
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error("Erreur lors de la requête GET:", error);
          return throwError(() => error);
        })
      );
  }

  // Méthode POST avec en-têtes
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error("Erreur lors de la requête POST:", error);
          return throwError(() => error);
        })
      );
  }
}
