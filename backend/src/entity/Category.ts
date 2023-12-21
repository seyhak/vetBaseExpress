import { UUID } from 'crypto';
import { Entity } from 'typeorm';

@Entity()
export class Category {
  id: UUID;
  firstName: string;
  email: string;
}
