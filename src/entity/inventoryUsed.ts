import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn, OneToMany, ManyToOne} from "typeorm"
import { Firm } from "./Firm"
import { InventoryTransaction } from "./InventoryTransaction"
import { InventoryType } from "./InventoryType"
import { Product } from "./product"
// import { WorkInProgress } from "./workInProgress"

@Entity({name:"inventory_used"})
export class InventoryUsed{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    iu_name:string


    @Column({
        type:"int"
    })
    iu_quantity:number
    
    
    // @ManyToOne(() => WorkInProgress, (workinprogress) => workinprogress.inventory_type)
    // work_in_progress: WorkInProgress

    @ManyToOne(() => Product, product => product.inventory_used)
    @JoinColumn()
    product: Product


   

}