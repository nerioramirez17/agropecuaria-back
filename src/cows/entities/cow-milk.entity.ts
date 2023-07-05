import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cow } from '.';

@Entity()
export class CowMilk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  liters: number;

  @Column('text')
  date: string;

  @ManyToOne(() => Cow, (cow) => cow.milk_register)
  cow: Cow;
}
