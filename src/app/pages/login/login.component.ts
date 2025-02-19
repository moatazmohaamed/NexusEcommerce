import { Component, inject, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private toastr: ToastrService) {}
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  id = inject(PLATFORM_ID);
  isLoading: boolean = false;
  errorMsg: string = '';
  success: string = '';
  login: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  submitData(): void {
    if (this.login.valid) {
      this.isLoading = true;
      this.authService.sendLoginData(this.login.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            localStorage.setItem('token', res.token);
            this.authService.decodeToken();
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 500);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMsg = err.error.message;
          this.isLoading = false;
        },
      });
    }
  }

  signUpWithGoogle() {
    this.authService.signUpWithGoogle().then(async (result) => {
      const token = await result.user.getIdToken();
      const userData = {
        email: result.user.email + 's',
        password: token,
      };
      console.log(userData);
      if (isPlatformBrowser(this.id)) {
        localStorage.setItem(
          'accountData',
          JSON.stringify(result.user.providerData)
        );
      }
      this.authService.sendLoginData(userData).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.toastr.error(err.error.message, 'login');
        },
      });
    });
  }

  signUpWithGithub() {
    this.authService.signUpWithGithub().then(async (result) => {
      const token = result.user.providerData[0].uid;
      if (isPlatformBrowser(this.id)) {
        localStorage.setItem(
          'accountData',
          JSON.stringify(result.user.providerData)
        );
      }
      const userData = {
        email: result.user.email + 's',
        password: token,
      };
      this.authService.sendLoginData(userData).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          }
        },
        error(err) {
          alert('you have to sign up first ');
        },
      });
    });
  }
}
