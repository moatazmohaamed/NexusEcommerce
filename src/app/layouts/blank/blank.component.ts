import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-blank',
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.scss',
})
export class BlankComponent {}
