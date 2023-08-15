import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cow } from '../../cows/entities/index';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class MedicationRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  medication: string;

  @Column('text')
  date: string;

  @ManyToOne(() => Cow, (cow) => cow.milk_register)
  @JoinColumn({ name: 'cow_id' })
  cow: Cow;

  @ManyToOne(() => User, (user) => user.cow, { eager: true })
  user: User;
}
