import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideRouter([
      { path: '', loadComponent: () => import('./app/pages/home-page/home-page.component').then(m => m.HomePageComponent) }
    ], withComponentInputBinding()),
    importProvidersFrom(MatChipsModule, MatIconModule)
  ]
});
