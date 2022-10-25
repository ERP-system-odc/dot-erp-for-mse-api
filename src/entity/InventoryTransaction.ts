import { Entity, PrimaryGeneratedColumn, Column,JoinColumn,CreateDateColumn,UpdateDateColumn, ManyToOne} from "typeorm"
import { InventoryType } from "./InventoryType"

export enum transaction_types{
    ADD="add",
    REMOVE="remove"
}

@Entity({name:"inventory_transactions"})
export class InventoryTransaction{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    transaction_name:string

    @Column({
        type:"enum",
        enum:transaction_types
    })
    transaction_type:string

    @Column({
        type:"double"
    })
    unit_price:number

    @Column({
        type:"double"
    })
    total_price:number

    @Column()
    initial_quantity:number

    @Column()
    current_quantity:number

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date


   
    @ManyToOne(() => InventoryType,
                inventory_type=>inventory_type.inventory_transactions)   
    @JoinColumn()
    inventory_type:InventoryType

}