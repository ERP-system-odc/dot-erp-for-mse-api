import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn,CreateDateColumn,UpdateDateColumn, ManyToOne} from "typeorm"
import { Firm } from "./Firm"

@Entity({name:"incomes"})
export class Income{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    income_name:string

    @Column(
        {
            type:"double"
        }  
    )
    income_amount:number

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date


    @ManyToOne(() => Firm,
                firm=>firm.incomes)   
    @JoinColumn()
    firm:Firm

}