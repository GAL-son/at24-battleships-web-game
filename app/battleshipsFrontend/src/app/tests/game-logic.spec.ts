import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../app/services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Mock localStorage
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: function (key: string) {
    return this.store[key] || null;
  },
  setItem: function (key: string, value: string) {
    this.store[key] = value;
  },
  removeItem: function (key: string) {
    delete this.store[key];
  },
};

describe('AuthService Unit Tests', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useClass: MockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem.bind(mockLocalStorage));
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem.bind(mockLocalStorage));
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem.bind(mockLocalStorage));
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test login
  it('should login and store token in localStorage', () => {
    const name = 'John Doe';
    const password = 'pass';
    const fakeResponse = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' };

    service.login(name, password).subscribe(response => {
      expect(response).toEqual(fakeResponse);
      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', fakeResponse.token);
    });

    const req = httpMock.expectOne('http://localhost:3001/api/session/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name, password });

    req.flush(fakeResponse);
    console.log('should login and store token in localStorage')
  });

  // Test logout
  it('should logout and clear token and navigate to home', () => {
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(router.navigate).toHaveBeenCalledWith(['../']);
    console.log('should logout and clear token and navigate to home')
  });

  // Test decodeToken
  it('should decode a valid token', () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    spyOn<any>(service as any, 'decodeToken').and.callThrough();

    service['decodeToken'](fakeToken);
    expect(service['currentUser']).toBeDefined();
    console.log('should decode a valid token')
  });
});
