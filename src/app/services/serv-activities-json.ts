import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from '../models/Activity';
import { Category } from '../models/Category';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServActivitiesJson {

  private activitiesUrl = "http://localhost:3000/activities";
  private categoriesUrl = "http://localhost:3000/categories";

  constructor(private httpclient: HttpClient) {}

  getActivities(): Observable<Activity[]> {
    return this.httpclient.get<Activity[]>(this.activitiesUrl);
  }

  getCategories(): Observable<Category[]> {
    return this.httpclient.get<Category[]>(this.categoriesUrl);
  }

  getActivityById(id: number): Observable<Activity> {
    return this.httpclient.get<Activity>(`${this.activitiesUrl}/${id}`);
  }

  getActiveActivities(): Observable<Activity[]> {
    return this.httpclient.get<Activity[]>(this.activitiesUrl)
      .pipe(map(activities => activities.filter(a => a.active === true)));
  }

  searchActivities(param: string): Observable<Activity[]> {
    return this.httpclient.get<Activity[]>(this.activitiesUrl)
      .pipe(map(activities =>
        activities.filter(a =>
          a.title.toLowerCase().includes(param.toLowerCase())
        )
      ));
  }

  create(activity: Activity): Observable<Activity> {
    return this.httpclient.post<Activity>(this.activitiesUrl, activity);
  }

  update(activity: Activity): Observable<Activity> {
    let urlToEdit = `${this.activitiesUrl}/${activity.id}`;
    return this.httpclient.put<Activity>(urlToEdit, activity);
  }

  delete(id: number): Observable<Activity> {
    let urlToDelete = `${this.activitiesUrl}/${id}`;
    return this.httpclient.delete<Activity>(urlToDelete);
  }
}
