import { Injectable, Logger } from '@nestjs/common';
import { db } from 'src/firebase.config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  where,
  query,
  limit,
  setDoc,
  addDoc,
} from 'firebase/firestore';
import { User } from 'src/auth/constants';
import { AuthUserDto } from 'src/auth/auth-user.dto';
import { DbUser } from './constants';

@Injectable()
export class UserService {
  constructor(private readonly logger: Logger) {}

  /*
    Returns User document if found, else null
  */
  async findOne(username: string): Promise<User | undefined> {
    const docRef = doc(db, 'users', username);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) {
      return undefined;
    }
    return { username: docSnap.id, ...docSnap.data() } as User;
  }

  async create({ username, password }: AuthUserDto) {
    try {
      const docRef = doc(db, 'users', username);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        throw new Error('User already exists');
      }

      const dbUser: DbUser = { password };
      await setDoc(doc(db, 'users', username), dbUser);
      this.logger.log(`User ${username} created`, 'UserService');
    } catch (e) {
      this.logger.warn(`Unable to create User: ${e.message}`, 'UserService');
      throw e;
    }
  }
}
