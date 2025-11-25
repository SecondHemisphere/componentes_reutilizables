import { Component } from '@angular/core';
import { DataTable } from '../../shared/data-table/data-table';
import { Activity } from '../../../models/Activity';
import { Category } from '../../../models/Category';
import { ServActivitiesJson } from '../../../services/serv-activities-json';
import { SearchFilter, SearchForm } from "../../shared/search-form/search-form";

@Component({
  selector: 'app-activity-crud',
  imports: [DataTable, SearchForm],
  templateUrl: './activity-crud.html',
  styleUrl: './activity-crud.css',
})
export class ActivityCrud {

  activities: Activity[] = []; // lista filtrada de actividades (las visibles en pantalla)
  allActivities: Activity[] = []; // lista completa de actividades (para restaurar filtros)
  categories: Category[] = []; // lista de categorías

  searchText: string = ""; // último texto ingresado en la búsqueda principal

  /** Filtros para las actividades */
  activitiesFilters: SearchFilter[] = [
    { type: 'text', field: 'location', label: 'Ubicación' },
    { type: 'date', field: 'date', label: 'Fecha' },
    { type: 'number', field: 'capacity', label: 'Cupos' },
    { type: 'select', field: 'categoryId', label: 'Categoría', options: [] }
  ];

  /** Columnas mostradas en la tabla */
  columnList = [
    { field: 'title', header: 'Actividad' },
    { field: 'date', header: 'Fecha' },
    { field: 'duration', header: 'Duración' },
    { field: 'location', header: 'Ubicación' },
    { field: 'capacity', header: 'Cupos' },
    {
      field: 'categoryId',
      header: 'Categoría',
      type: 'lookup',
      lookup: (id: number) => this.getCategoryName(id)
    },
    { field: 'description', header: 'Descripción', type: 'longtext' },
    { field: 'active', header: 'Activo', type: 'boolean' },
  ];

  constructor(private miServicio:ServActivitiesJson) {
    this.loadActivities();
    this.loadCategories();
  }

  /** Carga actividades */
  loadActivities() {
    this.miServicio.getActivities().subscribe((data: Activity[]) => {
      this.activities = data;
      this.allActivities = data;
    });
  }

  /** Carga categorías */
  loadCategories() {
    this.miServicio.getCategories().subscribe((data: Category[]) => {
      this.categories = data;

      const categoryFilter = this.activitiesFilters.find(f => f.field === 'categoryId');
      if (categoryFilter) {
        categoryFilter.options = data.map(c => c.name);
      }
    });
  }

  /** Devuelve el nombre de la categoría */
  getCategoryName(id: number): string {
    return this.categories.find(c => Number(c.id) === Number(id))?.name || 'Sin categoría';
  }

  /** Acción del botón Buscar desde el formulario de búsqueda */
  search(params: any) {

    // Caso de búsqueda simple
    if (typeof params === 'string') {
      this.searchText = params;
      this.applyFilters({}, params);
      return;
    }

    // Caso de filtros avanzados
    this.searchText = params.text || '';
    this.applyFilters(params, this.searchText);
  }

  /** Aplica búsqueda + filtros combinados */
  applyFilters(filtros: any, texto: string = "") {
    let result = [...this.allActivities];

    // Filtro por nombre
    if (texto.trim()) {
      result = result.filter(a =>
        a.title.toLowerCase().includes(texto.toLowerCase())
      );
    }

    // Filtro por ubicación
    if (filtros.location) {
      result = result.filter(a =>
        a.location.toLowerCase().includes(filtros.location.toLowerCase())
      );
    }

    // Filtro por fecha exacta
    if (filtros.date) {
      result = result.filter(a => a.date === filtros.date);
    }

    // Filtro por cupos
    if (filtros.capacity) {
      result = result.filter(a =>
        Number(a.capacity) === Number(filtros.capacity)
      );
    }

    // Filtro por categoría
    if (filtros.categoryId) {
      result = result.filter(a =>
        this.getCategoryName(a.categoryId) === filtros.categoryId
      );
    }

    this.activities = result;
  }

  /** Acción del botón Editar desde la tabla */
  edit(activity: Activity) {
    alert(`Editando la actividad ${activity.title}`);
  }

  /** Acción del botón Eliminar desde la tabla */
  delete(activity:Activity){
    const confirmado = confirm(`¿Estás seguro de eliminar la actividad? ${activity.title}`);
    if(confirmado){
      this.miServicio.delete(Number(activity.id)).subscribe(
        ()=>{
          alert("Eliminada exitosamente");
          this.loadActivities();
        }
      );
    }
  }
  
}
