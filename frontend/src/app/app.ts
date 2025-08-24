import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from './notification/notification';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, RouterModule, NotificationComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent {}
