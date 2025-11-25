import { Routes } from '@angular/router';
import { ActivityList } from './components/activities/activity-list/activity-list';
import { ActivityCrud } from './components/activities/activity-crud/activity-crud';

export const routes: Routes = [
    {path:"activity-list", component:ActivityList},
    {path:"activity-crud", component:ActivityCrud},
    //si no se indica ruta
    {path:"", redirectTo:"activity-list", pathMatch:"full"},
    //si la ruta no existe
    {path:"**", redirectTo:"activity-list"},
];
