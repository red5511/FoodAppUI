import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Input()
  isBodyCartRightBar!: boolean;

  @Output()
  onToggleSidnav: EventEmitter<any> = new EventEmitter<any>();

  ngOnChanges(): void {
    console.log('Visible ' + this.isSideNavVisible);
    console.log('Collapsed ' + this.isSideNavCollapsed);
    console.log('isTabletView ' + this.isTabletView);
    console.log('isBodyCartRightBar ' + this.isBodyCartRightBar);
  }
}
