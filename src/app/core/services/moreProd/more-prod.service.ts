import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { api_url } from '../../custom_injections/apiUrl';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoreProdService {
  constructor(
    private HttpClient: HttpClient,
    @Inject(api_url) private apiPath: string
  ) {}

  getAllProducts(page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString());
    return this.HttpClient.get<any>(`${this.apiPath}/products?${params}`);
  }

  getProdByCateogry(categoryId: string): Observable<any> {
    const params = new HttpParams().set('category[in]', categoryId.toString());
    return this.HttpClient.get<any>(`${this.apiPath}/products?${params}`);
  }
}
