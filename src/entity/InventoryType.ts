import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn, OneToMany, ManyToOne} from "typeorm"
import { Firm } from "./Firm"
import { InventoryTransaction } from "./InventoryTransaction"
import { Product } from "./product"
import { InventoryUsed } from "./inventoryUsed"
// import { WorkInProgress } from "./workInProgress"

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

   

    @Column({
        type:"int"
    })
    total_amount:number
    @OneToMany(()=>InventoryTransaction,
            inventory_transaction=>inventory_transaction.inventory_type
            )
    inventory_transactions:InventoryTransaction[]

    @ManyToOne(() => Firm,firm=>firm.inventory_types)   
    @JoinColumn()
    firm:Firm
    
    // @ManyToOne(() => Product, (product) => product.inventory_types)
    // products: Product

    @OneToMany(()=>InventoryUsed,inventory_used=>inventory_used.inventory_type)
    inventory_used:InventoryUsed[]

}