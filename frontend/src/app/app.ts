import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent {}
