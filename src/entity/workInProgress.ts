import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn,CreateDateColumn,UpdateDateColumn, ManyToOne, OneToMany} from "typeorm"
import { InventoryType } from "./InventoryType"
import { InventoryTransaction } from "./InventoryTransaction"

@Entity({name:"available_inventories"})
export class workInProgress{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    inventory_name:string

    @Column()
    inventory_quantity:number

    @Column({type:"double"})
    inventory_price:number

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date
    
    @OneToMany(() => InventoryType, (inventorytype) => inventorytype.workinprogress)
    inventorytypes: InventoryType[]
   
   
}