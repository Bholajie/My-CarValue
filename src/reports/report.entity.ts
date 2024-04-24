import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Report{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    price:number;

    @Column()
    make:string;

    @Column()
    year:number;

    @Column()
    lng:number;

    @Column()
    lat:number;

    @Column()
    mileage:number;

    @ManyToOne(() => User, (user) => user.reports)
    user: User;
};