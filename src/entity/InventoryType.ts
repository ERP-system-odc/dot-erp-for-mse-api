import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn, OneToMany, ManyToOne} from "typeorm"
import { Firm } from "./Firm"
import { AvailableInventory } from "./AvailableInventory"
import { workInProgress } from "./workInProgress"

@Entity({name:"inventory_types"})
export class InventoryType{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    inventory_name:string

   @Column({type:"double"})
    inventory_price:number

    @Column({type:"int"})
    least_critical_amount:number

    @OneToMany(()=>AvailableInventory,
            available_inventory=>available_inventory.inventory_type
            )
    available_inventories:AvailableInventory[]

    @ManyToOne(() => Firm,firm=>firm.inventory_types)   
    @JoinColumn()
    firm:Firm
    
    @ManyToOne(() => workInProgress, (workinprogress) => workinprogress.inventorytypes)
    workinprogress: workInProgress

}