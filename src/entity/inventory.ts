import { string } from "joi"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity,PrimaryColumn, CreateDateColumn} from "typeorm"
@Entity({name:"inventory"})
export class Inventory{

    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column("varchar",{length:200})
    materialName:string

   @Column({type:"int"})
    quantity:number

    @Column({type:"int"})
    unit:string

    @Column({type:"int"})
    price:number

    @Column()
    leastCriticalAmount:number

    @Column()
    expense:number

    @Column()
    @CreateDateColumn()
    createdAt: Date

}