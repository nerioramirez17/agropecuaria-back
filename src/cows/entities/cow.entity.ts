import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MilkRegister } from '../../milk_register/entities/milk_register.entity';

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
  })
  milk_register?: MilkRegister[] | null;
}
