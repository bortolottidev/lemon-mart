import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MediaChange } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Observable, of, Subscription } from 'rxjs';
import { SecurityContext } from '@angular/core';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {AuthService} from '../auth/auth.service';
import {AuthServiceFake} from '../auth/auth.service.fake';
import {UiService} from './ui.service';
import {UserService} from '../user/user/user.service';
import {UserServiceFake} from '../user/user/user.service.fake';
import {SharedComponentsModule} from '../shared-components/shared-components.module';

const FAKE_SVGS =  {
  lemon: '<svg><path id="lemon" name="lemon"></path></svg>'
}

export class ObservableMediaFake {
  isActive(query: string): boolean {
    return false;
  }

  asObservable(): Observable<MediaChange> {
    return of({} as MediaChange);
  }

  subscribe(
    next?: (value: MediaChange) => void,
    error?: (error: any) => void,
    complete?: () => void,
  ): Subscription {
    return new Subscription();
  }
}

export class MatIconRegistryFake {
  // tslint:disable-next-line:variable-name
  _document = document;
  addSvgIcon(iconName: string, url: SafeResourceUrl): this {
    return this;
  }

  getNamedSvgIcon(name: string, namespace: string = ''): Observable<SVGElement> {
    return of(this._svgElementFromString(FAKE_SVGS.lemon));
  }

  private _svgElementFromString(str: string): SVGElement {
    if (this._document || typeof document !== 'undefined') {
      const div = (this._document || document).createElement('DIV');
      div.innerHTML = str;
      const svg = div.querySelector('svg') as SVGElement;
      if (!svg) {
        throw Error('<svg> tag not found');
      }
      return svg;
    }
  }
}

export class DomSanitizerFake {
  bypassSecurityTrustResourceUrl(url: string): SafeResourceUrl {
    return {} as SafeResourceUrl;
  }
  sanitize(context: SecurityContext, value: SafeValue | string | null): string | null {
    return value ? value.toString() : null;
  }
}

export const commonTestingProviders: any[] = [
  { provide: AuthService,  useClass: AuthServiceFake },
  { provide: UserService, useClass: UserServiceFake },
  UiService,
];

export const commonTestingModules: any[] = [
  FormsModule,
  ReactiveFormsModule,
  MaterialModule,
  NoopAnimationsModule,
  HttpClientTestingModule,
  RouterTestingModule,
  SharedComponentsModule,
];
