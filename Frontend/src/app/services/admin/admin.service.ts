import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private api = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http
      .get<any>(`${this.api}/admin/profile`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getAverageKgPerDonation(): Observable<any> {
    return this.http
      .get<any>(`${this.api}/admin/average-kg-per-donation`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  getDonationsPerDistrict(): Observable<any> {
    return this.http
      .get<any>(`${this.api}/admin/donations-per-district`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  getClothingTypesPie(): Observable<any> {
    return this.http
      .get<any>(`${this.api}/admin/clothing-types-pie`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error fetching data');
  }

  updateProfile(admin: any): Observable<any> {
    return this.http.post(`${this.api}/admin/profile/update`, admin, {
      withCredentials: true,
    });
  }
}
