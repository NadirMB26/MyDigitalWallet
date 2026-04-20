import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, orderBy } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

export interface Transaction {
  id?: string;
  cardId: string;
  uid: string;
  merchant: string;
  merchantCategory: string;
  amount: number;
  currency: string;
  date: Date;
  status: 'approved' | 'declined';
  emoji?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  transactions$ = new BehaviorSubject<Transaction[]>([]);

  constructor(private firestore: Firestore) {}

  async processPayment(transaction: Omit<Transaction, 'id'>): Promise<string> {
    const ref = await addDoc(collection(this.firestore, 'transactions'), {
      ...transaction,
      date: new Date(),
    });
    return ref.id;
  }

  async loadTransactionsByUser(uid: string): Promise<Transaction[]> {
    const q = query(
      collection(this.firestore, 'transactions'),
      where('uid', '==', uid),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    const transactions = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Transaction[];
    this.transactions$.next(transactions);
    return transactions;
  }

  async loadTransactionsByCard(cardId: string): Promise<Transaction[]> {
    const q = query(
      collection(this.firestore, 'transactions'),
      where('cardId', '==', cardId),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Transaction[];
  }
}