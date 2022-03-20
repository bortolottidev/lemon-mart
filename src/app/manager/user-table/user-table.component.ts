import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../user/user/user.service';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {OptionalTextValidation} from '../../common/validations';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, of} from 'rxjs';
import {catchError, debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {IUser} from '../../user/user';

@Component({
  selector: 'app-user-table',
  template: `
    <div class="filter-row">
      <form style="margin-bottom: 32px">
        <div fxLayout="row">
          <mat-form-field class="full-width">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search" aria-label="Search" [formControl]="search">
            <mat-hint>Search by e-mail or name</mat-hint>
            <mat-error *ngIf="search.invalid">
              Type more than one character to search
            </mat-error>
          </mat-form-field>
        </div>
      </form>
    </div>
    <div class="mat-elevation-z8">
      <div class="loading-shade" *ngIf="isLoadingResults">
        <mat-spinner *ngIf="isLoadingResults"></mat-spinner>
        <div class="error" *ngIf="hasError">
          {{errorText}}
        </div>
      </div>
      <mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef mat-sort-header> Name </mat-header-cell>
          <mat-cell *matCellDef="let row"> {{row.name.first}} {{row.name.last}} </mat-cell>
        </ng-container>
        <ng-container matColumnDef="email">
          <mat-header-cell *matHeaderCellDef mat-sort-header> E-mail </mat-header-cell>
          <mat-cell *matCellDef="let row"> {{row.email}} </mat-cell>
        </ng-container>
        <ng-container matColumnDef="role">
          <mat-header-cell *matHeaderCellDef mat-sort-header> Role </mat-header-cell>
          <mat-cell *matCellDef="let row"> {{row.role}} </mat-cell>
        </ng-container>
        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef mat-sort-header> Status </mat-header-cell>
          <mat-cell *matCellDef="let row"> {{row.status}} </mat-cell>
        </ng-container>
        <ng-container matColumnDef="id">
          <mat-header-cell *matHeaderCellDef fxLayoutAlign="end center">View Details</mat-header-cell>
          <mat-cell *matCellDef="let row" fxLayoutAlign="end center" style="margin-right: 8px">
            <a mat-button mat-icon-button [routerLink]="['/manager/users', { outlets: { detail: ['user', {userId: row.id}] } }]" skipLocationChange>
              <mat-icon>visibility</mat-icon>
            </a>
          </mat-cell>
        </ng-container>
        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      </mat-table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]"></mat-paginator>
    </div>
  `,
  styles: [
  ]
})
export class UserTableComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'email', 'role', 'status', 'id'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  _isLoadingResults = true;
  _hasError = false;
  errorText = '';
  _skipLoading = false;
  search = new FormControl('', OptionalTextValidation);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    if (this._skipLoading) {
      return;
    }

    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.search.valueChanges.pipe(debounceTime(1000)),
    ).pipe(
      startWith({}),
      switchMap(() => {
        this._isLoadingResults = true;
        return this.userService.getUsers(
          this.paginator.pageSize,
          this.search.value,
          this.paginator.pageIndex
        );
      }),
      map((data: { total: number; items: IUser[]}) => {
        this._isLoadingResults = false;
        this._hasError = false;
        this.resultsLength = data.total;

        return data.items;
      }),
      catchError(err => {
        this._isLoadingResults = false;
        this._hasError = true;
        this.errorText = err;
        return of([]);
      })
    ).subscribe(data => this.dataSource.data = data);
  }

  get isLoadingResults() {
    return this._isLoadingResults;
  }

  get hasError() {
    return this._hasError;
  }

}
