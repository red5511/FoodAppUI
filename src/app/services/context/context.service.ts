import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators'; // Import map operator for transforming responses
import { CompanyDto } from '../models';

export interface Context {
  selectedCompany: CompanyDto;
  permittedModules: Array<
    | 'ONLINE_ORDERS'
    | 'STATISTICS'
    | 'ORDERS'
    | 'RESTAURANT_ORDERS'
    | 'ADMIN_PANEL'
    | string
  >;
  userId: number;
  companies: CompanyDto[];
  receivingCompanies: CompanyDto[];
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
    selectedCompany: CompanyDto, //active
    permittedModules: Array<string>,
    userId: number,
    companies: CompanyDto[],
    receivingCompanies: CompanyDto[]
  ) {
    const newContext: Context = {
      selectedCompany,
      permittedModules,
      userId,
      companies,
      receivingCompanies,
    };
    this.contextSubject.next(newContext);
  }

  setUserReceivingOrdersActive(isUserReceivingOrdersActive: boolean) {
    this.userReceivingOrdersSubject.next(isUserReceivingOrdersActive);
  }

  getCompanyIdObservable(): Observable<number> {
    return this.contextSubject.pipe(
      map((context) => context?.selectedCompany.id),
      filter((companyId): companyId is number => !!companyId)
    );
  }

  getContextObservable(): Observable<Context> {
    return this.contextSubjectVisibility$.pipe(
      filter((context) => context !== null && context !== undefined)
    );
  }

  getCompany(): CompanyDto | undefined {
    return this.contextSubject.getValue()?.selectedCompany;
  }

  getCompanyId(): number | undefined {
    return this.contextSubject.getValue()?.selectedCompany.id;
  }

  getDefaultProductImgUrl(): string | undefined {
    return this.contextSubject.getValue()?.selectedCompany.defaultProductImgUrl;
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

  getReceivingCompanies(): CompanyDto[] | undefined {
    return this.contextSubject.getValue()?.receivingCompanies;
  }

  getReceivingCompaniesTopicNames(): string[] | undefined {
    return this.contextSubject
      .getValue()
      ?.receivingCompanies.map((company) => company.webSocketTopicName);
  }

  getReceivingCompaniesIds(): number[] | undefined {
    return this.contextSubject
      .getValue()
      ?.receivingCompanies.map((company) => company.id);
  }

  isHolding(): boolean {
    return this.contextSubject.getValue()?.selectedCompany?.id === -888;
  }

  setReceivingCompaniesWithoutNext() {
    const currentContext = this.contextSubject.getValue();
    console.log(currentContext);
    if (currentContext) {
      // Modify the current value directly
      currentContext.receivingCompanies = [currentContext.selectedCompany];
      // Do not call next() to avoid notifying subscribers
    } else {
      console.error('Cannot update receivingCompanies: Context is null');
    }
  }

  setReceivingCompaniesWithoutNextHolding(companyIds: number[]): void {
    const currentContext = this.contextSubject.getValue();

    if (currentContext) {
      if (companyIds.length === 0) {
        currentContext.receivingCompanies.length = 0;
      } else {
        currentContext.receivingCompanies = currentContext.companies.filter(
          (company) => companyIds.includes(company.id)
        );
      }
    } else {
      console.error('Cannot update receivingCompanies: Context is null');
    }
  }
}
