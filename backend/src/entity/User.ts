import { Entity } from 'typeorm';

@Entity()
export class User {
  id: number;
  firstName: string;
  email: string;
}
