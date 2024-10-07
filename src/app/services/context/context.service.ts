import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient to make HTTP requests
import { map } from 'rxjs/operators'; // Import map operator for transforming responses

export interface Context {
  companyId: number;
  isCompanyReceivingOrdersActive: boolean;
  isUserReceivingOrdersActive: boolean;
  companyName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private contextSubject = new BehaviorSubject<Context | null>(null);
  contextSubjectVisibility$ = this.contextSubject.asObservable();

  constructor(private http: HttpClient) { }

  setContext(companyId: number, isCompanyReceivingOrdersActive: boolean, isUserReceivingOrdersActive: boolean, companyName: string) {
    const newContext: Context = {
      companyId,
      isCompanyReceivingOrdersActive,
      isUserReceivingOrdersActive,
      companyName
    };
    this.contextSubject.next(newContext);
  }

  setUserReceivingOrdersActive(isUserReceivingOrdersActive: boolean) {
    const currentContext = this.contextSubject.getValue();
    if (currentContext) {
      // Update only isUserReceivingOrdersActive and keep other properties the same
      const updatedContext: Context = {
        ...currentContext,
        isUserReceivingOrdersActive
      };
      this.contextSubject.next(updatedContext);
    }
  }

  getCompanyId(): Observable<number | undefined> {
    return this.contextSubject.pipe(
      map(context => context?.companyId)
    );
  }

  // Method to fetch initial context from an API
  fetchInitialContext(): Observable<Context> {
    return this.http.get<Context>('your-api-endpoint/config') // Replace with your actual endpoint
      .pipe(
        map(response => {
          this.setContext(response.companyId, response.isCompanyReceivingOrdersActive, response.isUserReceivingOrdersActive, response.companyName);
          return response; // Return the response for further chaining if needed
        })
      );
  }
}
