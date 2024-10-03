import { Injectable } from '@angular/core';
import { Context } from './context';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private contextSubject = new BehaviorSubject<Context | null>(null);
  contextSubjectVisibility$ = this.contextSubject.asObservable();

  constructor() { }

  setContext(companyId: number, isCompanyReceivingOrdersActive: boolean, isUserReceivingOrdersActive: boolean, companyName: string) {
    const newContext: Context = {
      companyId: companyId,
      isCompanyReceivingOrdersActive: isCompanyReceivingOrdersActive,
      isUserReceivingOrdersActive: isUserReceivingOrdersActive,
      companyName: companyName
    };
    this.contextSubject.next(newContext);
  }

  setUserReceivingOrdersActive(isUserReceivingOrdersActive: boolean) {
    const currentContext = this.contextSubject.getValue();
    if (currentContext) {
      // Update only isUserReceivingOrdersActive and keep other properties the same
      const updatedContext: Context = {
        ...currentContext,
        isUserReceivingOrdersActive: isUserReceivingOrdersActive
      };
      this.contextSubject.next(updatedContext);
    }
  }

  getCompanyId(): number | undefined {
    return this.contextSubject.getValue()?.companyId
  }
}
