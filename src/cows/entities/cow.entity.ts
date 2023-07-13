import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MilkRegister } from '../../milk_register/entities/milk_register.entity';
import { MeatRegister } from '../../meat_register/entities/meat_register.entity';
import { MedicationRegister } from 'src/medication_register/entities/medication_register.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Cow {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  id_paddock: string;

  @Column('int')
  id_cow_type: number;

  @Column('text')
  id_cow_mother: string;

  @Column('text')
  id_cow_father: string;

  @Column('text', {
    array: true,
  })
  id_childrens: string[];

  @Column('text')
  sex: string;

  @Column('text')
  birth_date: string;

  @Column('text')
  cow_info: string;

  @OneToMany(() => MilkRegister, (milkRegister) => milkRegister.cow, {
    cascade: true,
    eager: true,
  })
  milk_register?: MilkRegister[] | null;

  @OneToMany(() => MeatRegister, (meatRegister) => meatRegister.cow, {
    cascade: true,
    eager: true,
  })
  meat_register?: MeatRegister[] | null;

  @OneToMany(
    () => MedicationRegister,
    (medicationRegister) => medicationRegister.cow,
    {
      cascade: true,
      eager: true,
    },
  )
  medication_register?: MeatRegister[] | null;

  @ManyToOne(() => User, (user) => user.cow, { eager: true })
  user: User;
}
