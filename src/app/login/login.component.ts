import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../common/ui.service';
import {Role} from '../auth/role.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
    .error {
      color: red;
    }

    div[fxLayout] { margin-top: 32px; }
    `
  ]
})
export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private uiService: UiService,
  ) {
    route.paramMap.subscribe(params => this.redirectUrl = params.get('redirectUrl'));
  }

  loginForm: FormGroup;
  loginError = '';
  redirectUrl;

  private static homeRoutePerRole(role: Role): string {
    switch (role) {
      case Role.Cashier: return '/pos';
      case Role.Clerk: return '/inventory';
      case Role.Manager: return '/manager';
      default: return '/user/profile';
    }
  }

  ngOnInit(): void {
    this.buildLoginForm();
  }

  private buildLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    });
  }

  async login(submittedForm: FormGroup): Promise<void> {
    const { email, password } = submittedForm.value;
    this.authService.login(email, password)
      .subscribe(authStatus => {
        if (authStatus.isAuthenticated) {
          this.uiService.showToast(`Welcome on board ${authStatus.userRole}`);
          this.router.navigate([this.redirectUrl || LoginComponent.homeRoutePerRole(authStatus.userRole)]);
        }
      }, error => this.loginError = error);
  }

}
