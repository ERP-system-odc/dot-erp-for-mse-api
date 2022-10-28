import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn,CreateDateColumn,UpdateDateColumn, ManyToOne, OneToMany} from "typeorm"
import { InventoryType } from "./InventoryType"
import { InventoryUsed } from "./inventoryUsed"
import { Firm } from "./Firm"


@Entity({name:"products"})
export class Product{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    product_name:string

    @Column({type:"int"})
    product_quantity:number

    @Column({type:"double"})
    product_selling_price:number

    @Column({type:"double"})
    product_inventory_cost:number

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date
    
    // @ManyToOne(() => InventoryType, inventory_type => inventory_type.work_in_progress)
    // @JoinColumn()
    // inventory_type:InventoryType

    // @OneToMany(()=>InventoryType,inventory_type=>inventory_type.products)
    // inventory_types:InventoryType[]

    @OneToMany(()=>InventoryUsed,inventory_used=>inventory_used.product)
    inventory_used:InventoryUsed[]
    
    @ManyToOne(() => Firm, firm => firm.products)
    @JoinColumn()
    firm:Firm
   
   
}