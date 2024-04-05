
import { Column, Entity, PrimaryGeneratedColumn, } from "typeorm";
import { IsNotEmpty, IsNumber, } from "class-validator";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @IsNotEmpty()
    name: string

    @Column()
    @IsNotEmpty()
    description: string

    @Column()
    price: number

    @Column()
    @IsNumber()
    available_qty: number

    @Column()
    is_active: boolean
}