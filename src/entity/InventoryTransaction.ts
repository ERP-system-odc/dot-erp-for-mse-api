import { Entity, PrimaryGeneratedColumn, Column,JoinColumn,CreateDateColumn,UpdateDateColumn, ManyToOne} from "typeorm"
import { AvailableInventory } from "./AvailableInventory"

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
    price:number

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date


    @ManyToOne(() => AvailableInventory,
                available_inventory=>available_inventory.inventory_transactions)   
    @JoinColumn()
    available_inventory:AvailableInventory

}