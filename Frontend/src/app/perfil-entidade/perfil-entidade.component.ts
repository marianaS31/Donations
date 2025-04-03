import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntidadeService } from '../services/entidade.service';

@Component({
  selector: 'app-perfil-entidade',
  templateUrl: './perfil-entidade.component.html',
  styleUrls: ['./perfil-entidade.component.css']
})
export class PerfilEntidadeComponent implements OnInit {
  entidade: any;
  loading = true;
  error: string | null = null;
  defaultImageUrl: string = 'http://localhost:8000/public/Image/default.png';

  constructor(
    private route: ActivatedRoute,
    private entidadeService: EntidadeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entidadeService.getEntitieById(id).subscribe(
        (data) => {
          this.entidade = data;
          this.loading = false;
        },
        (error) => {
          this.error = error;
          this.loading = false;
        }
      );
    }
  }
  getImageUrl(imageName: string): string {
    if (imageName) {
      return 'http://localhost:8000/image/' + imageName;
    } else {
      return this.defaultImageUrl;
    }
  }
}