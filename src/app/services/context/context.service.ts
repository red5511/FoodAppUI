import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient to make HTTP requests
import { map } from 'rxjs/operators'; // Import map operator for transforming responses

export interface Context {
  companyId: number;
  // isCompanyReceivingOrdersActive: boolean;
  // isUserReceivingOrdersActive: boolean;
  companyName: string;
  mainWebSocketTopicName: string;
  permittedModules: Array<'LIVE_PANEL' | 'STATISTICS' | 'ORDERS'>;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  private contextSubject = new BehaviorSubject<Context | null>(null);
  contextSubjectVisibility$ = this.contextSubject.asObservable();

  private userReceivingOrdersSubject = new Subject<boolean>();
  userReceivingOrdersSubjectVisibility$ =
  
    this.userReceivingOrdersSubject.asObservable();

  constructor() {}

  setContext(
    companyId: number,
    companyName: string,
    mainWebSocketTopicName: string,
    permittedModules: Array<'LIVE_PANEL' | 'STATISTICS' | 'ORDERS'>,
    userId: number
  ) {
    const newContext: Context = {
      companyId,
      companyName,
      permittedModules,
      mainWebSocketTopicName,
      userId,
    };
    this.contextSubject.next(newContext);
  }

  setUserReceivingOrdersActive(isUserReceivingOrdersActive: boolean) {
    this.userReceivingOrdersSubject.next(isUserReceivingOrdersActive);
  }

  getCompanyIdObservable(): Observable<number | undefined> {
    return this.contextSubject.pipe(map((context) => context?.companyId));
  }

  getCompanyId(): number | undefined {
    return this.contextSubject.getValue()?.companyId;
  }

  getMainWebSocketTopicName(): string | undefined {
    return this.contextSubject.getValue()?.mainWebSocketTopicName;
  }

  getContext(): Context | null {
    return this.contextSubject.getValue();
  }

  getUserId(): number | undefined {
    return this.contextSubject.getValue()?.userId;
  }
}
