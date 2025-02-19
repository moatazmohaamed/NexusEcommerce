import { api_url } from './../../custom_injections/apiUrl';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBrands } from '../../../shared/interfaces/ibrands';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  constructor(
    private httpClient: HttpClient,
    @Inject(api_url) private apiPath: string
  ) {}

  getALlBrands(): Observable<IBrands> {
    return this.httpClient.get<IBrands>(`${this.apiPath}/brands`);
  }
}
