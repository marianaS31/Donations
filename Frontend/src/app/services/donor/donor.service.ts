import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DonorService {
  private apiUrl = 'http://localhost:8000/api/donor';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/profile`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  updateProfile(donor: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/update`, donor, {
      withCredentials: true,
    });
  }

  createDonor(donor: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/profile/add`, donor)
      .pipe(catchError(this.handleError));
  }

  checkEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-email?email=${email}`);
  }

  donorDonations(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/profile/ndonations`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  getDonationsByEmail(email: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/donations`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  getPointsEvolution(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/pointsEvolution`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  tradePointsForMoney(points: number): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/tradePointsForMoney`,
        { points },
        { withCredentials: true }
      )
      .pipe(catchError(this.handleError));
  }

  redeemCoupon(couponValue: number): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/redeemCoupon`,
        { couponValue },
        { withCredentials: true }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
