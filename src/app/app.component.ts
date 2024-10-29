import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isFullScreen!: boolean;

  constructor(
    private router: Router
  ) {}

  isExibirNavbar() {
    return this.router.url !== '/login' && !this.isFullScreen;
  }

}
