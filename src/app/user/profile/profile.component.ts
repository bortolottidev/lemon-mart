import { Component, OnInit } from '@angular/core';
import { Role as UserRole } from '../../auth/role.enum';
import {IUSState, PhoneType, USStateFilter} from './data';
import {$enum} from 'ts-enum-util';
import {EmailValidator, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {UserService} from '../user/user.service';
import {AuthService} from '../../auth/auth.service';
import {IPhone, IUser} from '../user';

import {
  BirthDateValidation,
  OneCharValidation,
  OptionalTextValidation,
  RequiredTextValidation, USAPhoneNumberValidation,
  USAZipCodeValidation
} from '../../common/validations';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  Role = UserRole;
  PhoneTypes = $enum(PhoneType).getKeys();
  userForm: FormGroup;
  states: Observable<IUSState[]>;
  userError = '';
  currentUserRole = this.Role.None;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.authStatus.subscribe(authStatus => this.currentUserRole = authStatus.userRole);
    this.userService.getCurrentUser().subscribe(user => this.buildUserForm(user));
    this.buildUserForm();
  }

  private buildPhoneFormControl(id, type?: string, num?: string): FormGroup {
    return this.formBuilder.group({
      id: [id],
      type: [type || '', Validators.required],
      number: [num || '', USAPhoneNumberValidation],
    });
  }

  private buildPhoneArray(phones: IPhone[]): FormGroup[] {
    const groups = [];

    if (!phones || (phones && phones.length === 0)) {
      groups.push(this.buildPhoneFormControl(1));
    } else {
      phones.forEach(p => {
        groups.push(this.buildPhoneFormControl(p.id, p.type, p.number));
      });
    }
    return groups;
  }

  get dateOfBirth(): Date {
    return this.userForm.get('dateOfBirth')?.value || new Date();
  }

  get age(): number {
    return new Date().getFullYear() - this.dateOfBirth.getFullYear();
  }

  buildUserForm(user?: IUser): void {
    this.userForm = this.formBuilder.group({
      email: [
        {
          value: user?.email || '',
          disabled: this.currentUserRole !== this.Role.Manager,
        },
        EmailValidator,
      ],
      name: this.formBuilder.group({
        first: [user?.name.first || '', RequiredTextValidation],
        middle: [user?.name.middle || '', OneCharValidation],
        last: [user?.name.last || '', RequiredTextValidation],
      }),
      role: [
        {
          value: user?.role || '',
          disabled: this.currentUserRole !== this.Role.Manager,
        },
        [Validators.required]
      ],
      dateOfBirth: [(user && user.dateOfBirth) || '', BirthDateValidation],
      address: this.formBuilder.group({
        line1: [
          user?.address?.line1 || '',
          RequiredTextValidation,
        ],
        line2: [
          user?.address?.line2 || '',
          OptionalTextValidation,
        ],
        city: [user?.address?.city || '', RequiredTextValidation],
        state: [
          user?.address?.state || '',
          RequiredTextValidation,
        ],
        zip: [user?.address?.zip || '', USAZipCodeValidation],
      }),
      phones: this.formBuilder.array(this.buildPhoneArray(user?.phones || [])),
    });
    this.states = this.userForm
      .get('address')
      .get('state')
      .valueChanges
      .pipe(
        startWith(''),
        map(value => USStateFilter(value)),
      );
  }

  addPhone(): void {
    this.phonesArray.push(
      this.buildPhoneFormControl(this.userForm.get('phones').value.length + 1)
    );
  }

  get phonesArray(): FormArray {
    return this.userForm.get('phones') as FormArray;
  }

  async save(form: FormGroup) {
    this.userService.updateUser(form.value)
      .subscribe(
        res => this.buildUserForm(res),
        err => this.userError = err,
      );
  }

}
