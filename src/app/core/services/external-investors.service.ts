import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ExternalInvestor } from '../models/external-investor.model';

@Injectable({
  providedIn: 'root',
})
export class ExternalInvestorsService {
  private readonly STORAGE_KEY = 'external-investors-records';

  private investorsSubject = new BehaviorSubject<ExternalInvestor[]>(this.loadFromLocalStorage());
  private filterSubject = new BehaviorSubject<string>('');

  public investors$: Observable<ExternalInvestor[]> = this.investorsSubject.asObservable();

  public filteredInvestors$: Observable<ExternalInvestor[]> = combineLatest([
    this.investors$,
    this.filterSubject.pipe(distinctUntilChanged()),
  ]).pipe(
    map(([investors, filter]) => {
      if (!filter.trim()) {
        return investors;
      }
      const lowerFilter = filter.toLowerCase().trim();
      return investors.filter((investor) => investor.name.toLowerCase().includes(lowerFilter));
    }),
  );

  private loadFromLocalStorage(): ExternalInvestor[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((item: ExternalInvestor) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
      } catch {
        return this.getSeedData();
      }
    }
    return this.getSeedData();
  }

  private saveToLocalStorage(): void {
    const investors = this.investorsSubject.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(investors));
  }

  private getSeedData(): ExternalInvestor[] {
    const now = new Date();
    return [
      {
        id: crypto.randomUUID(),
        name: 'جميع الوزارات',
        description: 'مجموعة جميع الوزارات الحكومية',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: 'جميع الهيئات',
        description: ' مجموعة جميع الهيئات الحكومية',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: 'الأمانات',
        description: 'قائمة الأمانات',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: 'الموردين',
        description: 'قائمة الموردين',
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  addInvestor(investorData: { name: string; description: string }): void {
    const now = new Date();
    const newInvestor: ExternalInvestor = {
      id: crypto.randomUUID(),
      name: investorData.name,
      description: investorData.description,
      createdAt: now,
      updatedAt: now,
    };

    const currentInvestors = this.investorsSubject.value;
    this.investorsSubject.next([...currentInvestors, newInvestor]);
    this.saveToLocalStorage();
  }

  updateInvestor(id: string, updates: Partial<ExternalInvestor>): void {
    const currentInvestors = this.investorsSubject.value;
    const updatedInvestors = currentInvestors.map((investor) =>
      investor.id === id ? { ...investor, ...updates, updatedAt: new Date() } : investor,
    );
    this.investorsSubject.next(updatedInvestors);
    this.saveToLocalStorage();
  }

  deleteInvestor(id: string): void {
    const currentInvestors = this.investorsSubject.value;
    const filteredInvestors = currentInvestors.filter((investor) => investor.id !== id);
    this.investorsSubject.next(filteredInvestors);
    this.saveToLocalStorage();
  }

  setFilter(term: string): void {
    this.filterSubject.next(term);
  }
}
