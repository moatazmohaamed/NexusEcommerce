import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { api_url } from '../../custom_injections/apiUrl';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import {
  Auth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly firebaseAuth = inject(Auth);
  constructor(
    private httpCLient: HttpClient,
    @Inject(api_url) private apiPath: string
  ) {}
  userData: any = '';
  router = inject(Router);

  sendRegisterData(data: object): Observable<any> {
    return this.httpCLient.post(`${this.apiPath}/auth/signup`, data);
  }
  sendLoginData(data: object): Observable<any> {
    return this.httpCLient.post(`${this.apiPath}/auth/signin`, data);
  }

  decodeToken(): void {
    return (this.userData = jwtDecode(localStorage.getItem('token')!));
  }

  loggedOut(): void {
    localStorage.clear();
    this.userData = null;
    this.router.navigate(['/login']);
  }

  verifyEmail(data: object): Observable<any> {
    return this.httpCLient.post(`${this.apiPath}/auth/forgotPasswords`, data);
  }

  verifyCode(code: string): Observable<any> {
    return this.httpCLient.post(`${this.apiPath}/auth/verifyResetCode`, code);
  }

  resetPass(code: any): Observable<any> {
    return this.httpCLient.put(`${this.apiPath}/auth/resetPassword`, code);
  }

  signUpWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.firebaseAuth, provider);
  }

  signUpWithGithub() {
    const provider = new GithubAuthProvider();
    return signInWithPopup(this.firebaseAuth, provider);
  }

  uptadePassword(data: object): Observable<any> {
    return this.httpCLient.put(`${this.apiPath}/users/changeMyPassword`, data);
  }
}
