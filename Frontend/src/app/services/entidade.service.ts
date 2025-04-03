import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EntidadeService {
  private apiUrl = 'http://localhost:8000/api/entidade';
  private mailgunApiUrl = 'http://localhost:8000/mail/send-email';

  constructor(private http: HttpClient) {}

  getAllEntities(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }
  
  getEntitieById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getPendingEntities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending-entities`)
      .pipe(
        catchError(this.handleError)
      );
  }
  acceptPendingEntity(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/accept/${id}`, {})
      .pipe(catchError(this.handleError));
  }
  rejectPendingEntity(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reject/${id}`, {})}
 /*
  updateProfile(entitie: any): Observable<any> {
    return this.http.post(
      `http://localhost:8000/api/entidade/profile/update`,
      entitie,
      {
        withCredentials: true,
      }
    );
  }
  getProfile(): Observable<any> {
    return this.http
      .get<any>('http://localhost:8000/api/entidade/profile', {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }
*/
  getDonations(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/donations`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  updateProfile(entitie: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/update`, entitie, {
      withCredentials: true,
    }).pipe(catchError(this.handleError));
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    return throwError('Error fetching Entitie profile');
  }

  createEntidade(entidade: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/add`, entidade)
      .pipe(
        catchError(this.handleError),
        switchMap(() => {
          return this.sendEmail(entidade);
        })
      );
  }

  private sendEmail(entidade: any): Observable<any> {
    const emailData = {
      from: 'info@sandboxaceb95645fa9467c8f057a45534cc8d9.mailgun.org',
      to: 'ricardocunha98@gmail.com',
      subject: 'Nova Entidade Criada',
      text: `Uma nova entidade foi criada:\nNome: ${entidade.name}\nDescrição: ${entidade.description}\nImagem: ${entidade.image}\nDistrito: ${entidade.distrito}\nEmail: ${entidade.email}\nSenha: ${entidade.password}`
    };

    return this.http.post(this.mailgunApiUrl, emailData)
      .pipe(catchError(this.handleError));
  }

}
