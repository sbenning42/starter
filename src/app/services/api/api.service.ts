import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseZtohub = environment.ztohub;
  baseSteamuloV1 = environment.steamuloV1;
  baseSteamuloV2 = environment.steamuloV2;

  constructor(public http: HttpClient) { }

  hubThemes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseZtohub}/themes`);
  }
  hubFilters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseZtohub}/filter`).pipe(
      map(r => r.slice(0, 25))
    );
  }
  hubFilterId(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseZtohub}/filter/${id}`);
  }

  steamuloLogin(credentials: {login: string, password: string}): Observable<any> {
    return this.http.post<any>(`${this.baseSteamuloV1}/internautes/login`, credentials, {withCredentials: true});
  }
  steamuloUserPreferences(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseSteamuloV1}/internautes/${id}/preferences`, {withCredentials: true});
  }
  steamuloUserUpdatePreferences(id: string, preferences: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseSteamuloV1}/internautes/${id}/preferences`, preferences, {withCredentials: true});
  }
  setamuloUserAddresses(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseSteamuloV1}/internautes/${id}/adresses`, {withCredentials: true});
  }

}
