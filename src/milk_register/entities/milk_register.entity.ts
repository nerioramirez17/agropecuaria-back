import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cow } from '../../cows/entities/index';

@Entity()
export class MilkRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  liters: number;

  @Column('text')
  date: string;

  @ManyToOne(() => Cow, (cow) => cow.milk_register)
  @JoinColumn({ name: 'cow_id' })
  cow: Cow;
}
