import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn,CreateDateColumn,UpdateDateColumn, ManyToOne} from "typeorm"
import { Firm } from "./Firm"

@Entity({name:"expenses"})
export class Expense{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
   expense_name :string

    @Column(
        {
            type:"double"
        }  
    )
    expense_amount:number

    
    @Column({
        type:"int"
    })
    total_amount:number

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date


    @ManyToOne(() => Firm,
                firm=>firm.expenses)   
    @JoinColumn()
    firm:Firm

}