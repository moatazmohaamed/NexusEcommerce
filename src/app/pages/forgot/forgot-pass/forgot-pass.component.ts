import { AuthService } from './../../../core/services/auth/auth.service';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-pass.component.html',
  styleUrl: './forgot-pass.component.scss',
})
export class ForgotPassComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  resetMsg: string = '';
  codeMsg: string = '';

  step: number = 1;
  isLoading!: boolean | null;
  verifyEmail: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  verifyCode: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[0-9](6)&/),
    ]),
  });

  resetPass: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9!@#$%^&*]{6,16}$/),
    ]),
  });

  verifyEmailSub(): void {
    this.isLoading = true;
    this.authService.verifyEmail(this.verifyEmail.value).subscribe({
      next: (res) => {
        if (res.statusMsg == 'success') {
          this.step = 2;
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.resetMsg = err.error.message;
        this.isLoading = false;
        console.log(err);
      },
    });
  }

  verifyCodeSub(): void {
    this.isLoading = true;
    this.authService.verifyCode(this.verifyCode.value!).subscribe({
      next: (res) => {
        this.step = 3;
        this.isLoading = false;
      },
      error: (err) => {
        this.codeMsg = err.error.message;
        this.isLoading = false;
        console.log(err);
      },
    });
  }

  resetPassSub(): void {
    this.isLoading = true;
    this.authService.resetPass(this.resetPass.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.authService.decodeToken();
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }
}
