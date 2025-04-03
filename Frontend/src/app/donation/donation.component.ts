import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { PaypalService } from '../services/paypal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

declare var paypal: any;

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css'],
})
export class DonationComponent implements AfterViewInit {
  successMessage: String = '';
  amount: number = 0;
  donorEmail: string = '';
  entity: string = '';
  donationType: string = 'money';
  clothDonations: {
    weight: number;
    color: string;
    type: string;
    state: string;
  }[] = [];
  state: string = 'Entregue diretamente';
  paypalScriptLoaded = false;
  errorMessage: string = '';

  constructor(
    private paypalService: PaypalService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.loadPaypalScript();
  }

  loadPaypalScript() {
    const script = this.renderer.createElement('script');
    script.src =
      'https://www.paypal.com/sdk/js?client-id=ATBCTbVoOVooMma2m6DNs78XpyvWDADX_dI5cpFk1FMLikIJQgXmgaxXS0dZtcOI_fzybj4SNCwCXK7O';
    script.onload = () => {
      this.paypalScriptLoaded = true;
      console.log('PayPal SDK script loaded successfully.');
      if (this.donationType === 'money') {
        this.renderPaypalButton();
      }
    };
    script.onerror = (error: any) => {
      console.error('PayPal SDK could not be loaded.', error);
    };
    this.renderer.appendChild(document.body, script);
  }

  renderPaypalButton() {
    if (!this.paypalScriptLoaded) {
      console.error('PayPal SDK script not loaded yet.');
      return;
    }

    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.amount.toString(),
                },
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            console.log('Payment approved:', details);
            const paymentId = details.id;
            const payerId = details.payer.payer_id;
            this.createDoacao(paymentId, payerId);
          });
        },
        onError: (err: any) => {
          console.error('Error during PayPal payment:', err);
        },
      })
      .render('#paypal-button-container');
  }

  createDoacao(paymentId: string, payerId: string) {
    const donationData: any = {
      donorEmail: this.donorEmail,
      entity: this.entity,
      paymentId: paymentId,
      payerId: payerId,
    };

    if (this.donationType === 'money') {
      donationData.amount = this.amount;
    } else if (this.donationType === 'cloth') {
      donationData.clothDonations = this.clothDonations.map((donation) => ({
        ...donation,
        state: this.state,
      }));
    }

    this.paypalService.createDoacao(donationData).subscribe(
      (response: any) => {
        console.log('Donation successful:', response);
        this.successMessage = 'Donation done successfully!';
        alert(this.successMessage); // Display success alert
        this.router.navigate(['/']);
      },
      (error: any) => {
        console.error('Error creating donation:', error);
        this.errorMessage = error.error?.error || 'An error occurred';
      }
    );
  }

  onSubmit(form: NgForm) {
    if (this.donationType === 'money') {
      if (this.amount >= 1) {
        if (this.paypalScriptLoaded) {
          this.renderPaypalButton();
        } else {
          this.loadPaypalScript();
        }
      } else {
        this.errorMessage = 'Amount must be at least 1';
      }
    } else if (this.donationType === 'cloth') {
      if (
        this.clothDonations.every(
          (donation) => donation.weight >= 0 && donation.color && donation.type
        )
      ) {
        this.createDoacao('', '');
      } else {
        this.errorMessage =
          'Please fill out all cloth donation fields correctly';
      }
    }
  }

  addClothDonation() {
    this.clothDonations.push({
      weight: 0,
      color: '',
      type: '',
      state: this.state,
    });
  }

  removeClothDonation(index: number) {
    this.clothDonations.splice(index, 1);
  }

  onDonationTypeChange() {
    if (this.donationType === 'money' && this.paypalScriptLoaded) {
      this.renderPaypalButton();
    }
  }
}
