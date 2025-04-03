import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaypalService {
  private baseUrl = 'http://localhost:8000/api/donations'; // Substitua pela URL base do seu backend

  constructor(private http: HttpClient) {}

  createPaypalPayment(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-paypal-payment`, { amount });
  }

  executePaypalPayment(paymentId: string, payerId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/execute-paypal-payment`, {
      paymentId,
      payerId,
    });
  }

  createDoacao(donationData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-doacao`, donationData);
  }
}
