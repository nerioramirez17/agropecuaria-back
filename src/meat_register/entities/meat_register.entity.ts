import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cow } from '../../cows/entities/index';

@Entity()
export class MeatRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  kg: number;

  @Column('text')
  date: string;

  @ManyToOne(() => Cow, (cow) => cow.meat_register)
  @JoinColumn({ name: 'cow_id' })
  cow: Cow;
}
