import { Component, inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { IStaticMethods } from 'preline/preline';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'nexus-ecommerce';
  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  private readonly ID = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {});
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && isPlatformBrowser(this.ID)) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });

    this.ngxSpinnerService.show();
  }
}
