import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators'; // Import map operator for transforming responses
import { CompanyDto } from '../models';

export interface Context {
  companyId: number;
  // isCompanyReceivingOrdersActive: boolean;
  // isUserReceivingOrdersActive: boolean;
  companyName: string;
  mainWebSocketTopicName: string;
  permittedModules: Array<'LIVE_PANEL' | 'STATISTICS' | 'ORDERS'>;
  userId: number;
  companies: CompanyDto[];
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
    companyId: number, //active
    companyName: string, //active
    mainWebSocketTopicName: string,
    permittedModules: Array<'LIVE_PANEL' | 'STATISTICS' | 'ORDERS'>,
    userId: number,
    companies: CompanyDto[]
  ) {
    const newContext: Context = {
      companyId,
      companyName,
      permittedModules,
      mainWebSocketTopicName,
      userId,
      companies,
    };
    this.contextSubject.next(newContext);
  }

  setUserReceivingOrdersActive(isUserReceivingOrdersActive: boolean) {
    this.userReceivingOrdersSubject.next(isUserReceivingOrdersActive);
  }

  getCompanyIdObservable(): Observable<number> {
    return this.contextSubject.pipe(
      map((context) => context?.companyId),
      filter((companyId): companyId is number => !!companyId)
    );
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

  getCompanies(): CompanyDto[] | undefined {
    return this.contextSubject.getValue()?.companies;
  }

  isHolding(): boolean {
    return this.contextSubject.getValue()?.companyId === -888;
  }
}
