import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: "date"
  })
  date: Date;

  @Column()
  value: number;
}