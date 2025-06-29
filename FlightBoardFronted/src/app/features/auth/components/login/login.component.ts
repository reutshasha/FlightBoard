import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../../../../angular-material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackBarUtil } from '../../../../shared/utilities/snack-bar.util';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [AngularMaterialModule, FormsModule, RouterModule, CommonModule, HttpClientModule],

})
export class LoginComponent {
  username = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(SnackBarUtil);

  onSubmit(username: string, password: string) {
    this.authService.login(username, password).subscribe({
      next: (token) => {
        this.authService.setToken(token);
        this.snackBar.show("Login successful!");
        this.router.navigate(['/flight-board']);
      },
      error: (err) => {
        this.snackBar.show("Login Failed ");
      },
    });
  }
}
