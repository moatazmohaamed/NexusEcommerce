import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './../../core/services/auth/auth.service';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  readonly authService = inject(AuthService);
  readonly formBuilder = inject(FormBuilder);
  readonly toastrService = inject(ToastrService);
  user: any = '';
  userData!: any;
  id = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.getUserAccount();
  }

  getUserAccount() {
    if (isPlatformBrowser(this.id)) {
      this.user = JSON.parse(localStorage.getItem('accountData')!);
    }
    this.userData = this.authService.decodeToken();
  }

  passwordForm: FormGroup = this.formBuilder.group({
    currentPassword: [null, Validators.required],
    password: [null, Validators.required],
    rePassword: [null, Validators.required],
  });

  submitData(): void {
    this.authService.uptadePassword(this.passwordForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.toastrService.success('Password Has Changed', res.message);
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      },
    });
  }
}
