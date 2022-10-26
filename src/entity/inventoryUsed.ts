import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn, OneToMany, ManyToOne} from "typeorm"
import { Firm } from "./Firm"
import { InventoryTransaction } from "./InventoryTransaction"
// import { WorkInProgress } from "./workInProgress"

@Entity({name:"inventoryused"})
export class InventoryType{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    inventory_name:string


    @Column({
        type:"int"
    })
    total_amount:number
    
    
    // @ManyToOne(() => WorkInProgress, (workinprogress) => workinprogress.inventory_type)
    // work_in_progress: WorkInProgress

}