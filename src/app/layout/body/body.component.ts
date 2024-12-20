import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
})
export class BodyComponent {
  @Input()
  isSideNavVisible!: boolean;

  @Input()
  isSideNavCollapsed!: boolean;

  @Input()
  isTabletView!: boolean;

  @Input()
  isLoggedIn!: boolean;
}
