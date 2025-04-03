import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntidadeService } from '../services/entidade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entity-register',
  templateUrl: './criar-entidade.component.html',
  styleUrls: ['./criar-entidade.component.css']
})
export class CriarEntidadeComponent {
  entidadeForm: FormGroup;
  errorMessages: string[] = [];
  successMessage: string = '';
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private entidadeService: EntidadeService, private router: Router) {
    this.entidadeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      description: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      distrito: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get formControls() {
    return this.entidadeForm.controls;
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    this.errorMessages = [];
    this.successMessage = '';

    if (this.entidadeForm.invalid) {
      this.setFormErrors();
      return;
    }

    if (!this.selectedFile) {
      this.errorMessages.push('Por favor, selecione uma imagem.');
      return;
    }

    const entidadeData = this.entidadeForm.value;
    const formData = new FormData();
    formData.append('name', entidadeData.name);
    formData.append('description', entidadeData.description);
    formData.append('distrito', entidadeData.distrito);
    formData.append('email', entidadeData.email);
    formData.append('password', entidadeData.password);
    formData.append('image', this.selectedFile!, this.selectedFile!.name);

    this.entidadeService.createEntidade(formData).subscribe(
      () => {
        this.successMessage = 'Entidade criada com sucesso!';
        alert(this.successMessage);  // Display success alert
        this.router.navigate(['/']);
      },
      (error) => {
        if (error.error.errors) {
          this.errorMessages = error.error.errors;
        } else {
          this.errorMessages.push(error.message || 'Ocorreu um erro');
        }
        console.error(error);
      }
    );
  }

  private setFormErrors(): void {
    Object.keys(this.formControls).forEach(key => {
      const controlErrors = this.formControls[key].errors;
      if (controlErrors) {
        for (const errorKey in controlErrors) {
          switch (errorKey) {
            case 'required':
              this.errorMessages.push(`${key} é obrigatório.`);
              break;
            case 'pattern':
              this.errorMessages.push(`${key} possui um formato inválido.`);
              break;
            case 'email':
              this.errorMessages.push('Formato de email inválido.');
              break;
            case 'minlength':
              this.errorMessages.push(`${key} deve ter pelo menos ${controlErrors['minlength'].requiredLength} caracteres.`);
              break;
            default:
              this.errorMessages.push(`${key} possui um erro: ${errorKey}.`);
              break;
          }
        }
      }
    });
  }
}
