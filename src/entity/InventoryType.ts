import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn, OneToMany} from "typeorm"
import { Firm } from "./Firm"
import { AvailableInventory } from "./AvailableInventory"

@Entity({name:"inventory_types"})
export class InventoryType{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    inventory_name:string

   @Column({
    type:"double"
   })
    inventory_price:number

    @Column({
        type:"int"
    })
    least_critical_amount:number

    @OneToMany(()=>AvailableInventory,
            available_inventory=>available_inventory.inventory_type
            )
    available_inventories:AvailableInventory[]

    @OneToOne(() => Firm)   
    @JoinColumn()
    firm:Firm

}