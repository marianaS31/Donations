import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private baseUrl = 'http://localhost:8000/api/donations'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getDonations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list-doacoes`);
  }

  updateDonationState(
    entityName: string,
    index: number,
    newState: string
  ): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/update-state/${entityName}/${index}`,
      { state: newState }
    );
  }

  deleteDonation(donationId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${donationId}`);
  }
}
