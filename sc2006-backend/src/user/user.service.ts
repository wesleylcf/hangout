import { Injectable } from '@nestjs/common';
import { db } from 'src/firebase.config';
import { collection, doc, getDoc } from 'firebase/firestore';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {
  // to update to using firestore
  async findOne(username: string): Promise<User | undefined> {
    const docRef = doc(db, 'users', username);
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
    }
  }
}
