import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
})
export class BodyComponent {
  bodyClass = '';
  private _isSidebarVisible = true;
  private _screenWidth = 0;
  private _isLoggedIn = true;

  @Input() set isSidebarVisible(value: boolean) {
    this._isSidebarVisible = value;
    this.updateBodyClass();
  }
  get isSidebarVisible(): boolean {
    return this._isSidebarVisible;
  }
  @Input() set screenWidth(value: number) {
    this._screenWidth = value;
    this.updateBodyClass();
  }
  get screenWidth(): number {
    return this._screenWidth;
  }

  @Input() set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
    this.updateBodyClass();
  }

  updateBodyClass(): string {
    if (!this._isLoggedIn || this._screenWidth <= 1000) {
      this.bodyClass = 'body-normal';
    } else if (this._isSidebarVisible) {
      this.bodyClass = 'body-trimmed';
    } else {
      this.bodyClass = 'body-md-screen';
    }
    console.log(this.bodyClass);

    // else if (!this._isSidebarVisible && this._screenWidth <= 768 && this._screenWidth > 0) {
    //   this.bodyClass = 'body-md-screen'
    // }
    return this.bodyClass;
  }
}
