import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

/** Define los filtros disponibles en el buscador */
export interface SearchFilter {
  type: 'text' | 'select' | 'date' | 'number'; // tipo de filtro
  field: string; // nombre del campo
  label: string; // texto visible
  options?: any[]; // opciones para select
  placeholder?: string; // texto de ayuda
}

@Component({
  selector: 'app-search-form',
  imports: [ReactiveFormsModule],
  templateUrl: './search-form.html',
  styleUrl: './search-form.css',
})
export class SearchForm {

  @Input() placeholder: string = ""; // texto en el buscador principal
  @Input() filters: SearchFilter[] = []; // lista de filtros

  @Output() onSearch = new EventEmitter<any>(); // evento cuando se busca

  searchControl = new FormControl(''); // buscador principal
  filterForm: FormGroup = new FormGroup<Record<string, FormControl>>({}); // filtros adicionales

  ngOnInit() {
    this.filters.forEach(f => {
      this.filterForm.addControl(f.field, new FormControl(''));
    });
  }

  /** Obtiene un filtro específico */
  getControl(field: string): FormControl {
    return this.filterForm.get(field)! as FormControl;
  }

  /** Envia la búsqueda */
  emitSearch() {
    const text = this.searchControl.value;
    const filters = this.filterForm.value;

    if (!this.filters.length) {
      this.onSearch.emit(text);
      return;
    }

    this.onSearch.emit({
      text,
      ...filters
    });
  }

  /** Acción del botón Buscar */
  search() {
    this.emitSearch();
  }

  /** Limpia todos los campos */
  clear() {
    this.searchControl.setValue('');

    Object.keys(this.filterForm.controls).forEach(key => {
      const filter = this.filters.find(f => f.field === key);

      if (filter?.type === 'select') {
        this.filterForm.get(key)?.setValue('');
      } else {
        this.filterForm.get(key)?.reset('');
      }
    });
  }

}
