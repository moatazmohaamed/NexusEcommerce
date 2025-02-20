import { Component, inject, PLATFORM_ID } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private toastr: ToastrService) {}
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoading: boolean = false;
  id = inject(PLATFORM_ID);
  errorMsg: string = '';
  signed: boolean = true;
  success: string = '';
  register: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9!@#$%^&*]{6,}$/),
      ]),
      rePassword: new FormControl(null),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),
    },
    { validators: this.confrimPassword }
  );

  submitData(): void {
    if (this.register.valid) {
      this.isLoading = true;
      this.authService.sendRegisterData(this.register.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);
            this.success = res.message;
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMsg = err.error.message;
          this.isLoading = false;
        },
      });
    } else {
      this.register.markAllAsTouched();
    }
  }

  confrimPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const repassword = group.get('rePassword')?.value;
    return password === repassword ? null : { mismatch: true };
  }

  signUpWithGoogle() {
    this.authService.signUpWithGoogle().then(async (result) => {
      const token = await result.user.getIdToken();
      let userData = {
        name: result.user.displayName,
        email: result.user.email,
        password: token,
        rePassword: token,
        phone: result.user.phoneNumber || '01234567877',
      };
      if (isPlatformBrowser(this.id)) {
        localStorage.setItem(
          'accountData',
          JSON.stringify(result.user.providerData)
        );
      }
      this.authService.sendRegisterData(userData).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          if (err) {
            this.signed = false;
            this.toastr.error('Account already Exists', 'Go login');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);
          }
        },
      });

      let loginData = {
        email: result.user.email,
        password: token,
      };

      this.authService.sendLoginData(loginData).subscribe({
        next: (res) => {
          if (res.message === 'success' && this.signed === true) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          }
        },
      });
    });
  }

  signUpWithGithub() {
    this.authService.signUpWithGithub().then(async (result) => {
      const token = result.user.providerData[0].uid;

      let userData = {
        name: result.user.displayName,
        email: result.user.email,
        password: token,
        rePassword: token,
        phone: result.user.phoneNumber || '',
      };

      if (isPlatformBrowser(this.id)) {
        localStorage.setItem(
          'accountData',
          JSON.stringify(result.user.providerData)
        );
      }

      this.authService.sendRegisterData(userData).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.router.navigate(['/home']);
            localStorage.setItem('token', res.token);
          }
        },
        error: (err) => {
          if (err) {
            this.signed = false;
            this.toastr.error('Account already Exists', 'Go login');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);
          }
        },
      });

      let loginData = {
        email: result.user.email,
        password: token,
      };

      this.authService.sendLoginData(loginData).subscribe({
        next: (res) => {
          if (res.message === 'success' && this.signed) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          } else {
            this.toastr.error('Account already Exists', 'Go login');
          }
        },
      });
    });
  }
}
