import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api/v1/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  getSpecialites<T>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}specialites`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getPraticiens<T>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}praticiens`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  postPraticien<T>(data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}praticiens`, data, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updatePraticien<T>(data: any, id: string): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}praticiens/${id}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  deletePraticien<T>(id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}praticiens/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
