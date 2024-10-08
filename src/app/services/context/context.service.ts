import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient to make HTTP requests
import { map } from 'rxjs/operators'; // Import map operator for transforming responses

export interface Context {
  companyId: number;
  // isCompanyReceivingOrdersActive: boolean;
  // isUserReceivingOrdersActive: boolean;
  companyName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private contextSubject = new BehaviorSubject<Context | null>(null);
  contextSubjectVisibility$ = this.contextSubject.asObservable();

  private userReceivingOrdersSubject = new BehaviorSubject<boolean>(false);
  userReceivingOrdersSubjectVisibility$ = this.userReceivingOrdersSubject.asObservable();

  constructor(private http: HttpClient) { }

  // setContext(companyId: number, isCompanyReceivingOrdersActive: boolean, isUserReceivingOrdersActive: boolean, companyName: string) {
  //   const newContext: Context = {
  //     companyId,
  //     isCompanyReceivingOrdersActive,
  //     isUserReceivingOrdersActive,
  //     companyName
  //   };
  //   this.contextSubject.next(newContext);
  // }
  setContext(companyId: number, companyName: string) {
    const newContext: Context = {
      companyId,
      companyName
    };
    this.contextSubject.next(newContext);
  }

  setUserReceivingOrdersActive(isUserReceivingOrdersActive: boolean) {
    this.userReceivingOrdersSubject.next(isUserReceivingOrdersActive);
  }

  getCompanyIdObservable(): Observable<number | undefined> {
    return this.contextSubject.pipe(
      map(context => context?.companyId)
    );
  }

  getCompanyId(): number | undefined {
    return this.contextSubject.getValue()?.companyId

  }
}
