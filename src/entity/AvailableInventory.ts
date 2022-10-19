import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn,CreateDateColumn,UpdateDateColumn, ManyToOne, OneToMany} from "typeorm"
import { InventoryType } from "./InventoryType"
import { InventoryTransaction } from "./InventoryTransaction"

@Entity({name:"available_inventories"})
export class AvailableInventory{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    initial_quantity:number

    @Column()
    current_quantity:number

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date


    @ManyToOne(() => InventoryType,
                inventory_type=>inventory_type.available_inventories)   
    @JoinColumn()
    inventory_type:InventoryType

    @OneToMany(()=>InventoryTransaction,
    inventory_transaction=>inventory_transaction.available_inventory)
    inventory_transactions:InventoryTransaction[]
}