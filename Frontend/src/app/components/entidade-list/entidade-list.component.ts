import { Component, OnInit } from '@angular/core';
import { EntidadeService } from '../../services/entidade.service';

@Component({
  selector: 'app-entidade-list',
  templateUrl: './entidade-list.component.html',
  styleUrls: ['./entidade-list.component.css']
})
export class EntidadeListComponent implements OnInit {
  entidades: any[] = [];
  filteredEntidades: any[] = [];
  defaultImageUrl: string = 'http://localhost:8000/image/default.png'; // URL da imagem padrão
  searchText: string = '';

  constructor(private entidadeService: EntidadeService) { }

  ngOnInit(): void {
    this.entidadeService.getAllEntities().subscribe(
      (data) => {
        this.entidades = data;
        this.filteredEntidades = data;
      },
      (error) => {
        console.error('Erro ao buscar entidades', error);
      }
    );
  }

  filterEntidades(): void {
    if (!this.searchText) {
      this.filteredEntidades = this.entidades;
    } else {
      const searchTextLower = this.searchText.toLowerCase();
      this.filteredEntidades = this.entidades.filter(entidade => 
        entidade.name.toLowerCase().includes(searchTextLower) ||
        entidade.distrito.toLowerCase().includes(searchTextLower)
      );
    }
  }

  getImageUrl(imageName: string): string {
    if (imageName) {
      // Verifica se a imagem correspondente está disponível
      // Se estiver, retorna a URL da imagem correspondente
      return 'http://localhost:8000/image/' + imageName;
    } else {
      // Se não houver imagem correspondente, retorna a URL da imagem padrão
      return this.defaultImageUrl;
    }
  }
}
