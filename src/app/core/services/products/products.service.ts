import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_url } from '../../custom_injections/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(
    private httpClient: HttpClient,
    @Inject(api_url) private apiPath: string
  ) {}

  getAllProducts(): Observable<any> {
    return this.httpClient.get(`${this.apiPath}/products`);
  }
  getSpecificProducts(id: string): Observable<any> {
    return this.httpClient.get(`${this.apiPath}/products/${id}`);
  }
}
