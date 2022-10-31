import { Entity, PrimaryGeneratedColumn, Column,OneToOne,JoinColumn,CreateDateColumn,UpdateDateColumn, ManyToOne} from "typeorm"
// import { Firm } from "./Firm"

@Entity({name:"incomes"})
export class Employee{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    employee_name:string

    @Column(
        {
            type:"double"
        }  
    )
    salary_amount:number

    @Column(
        {
            type:"double"
        }  
    )
    payment_schedule:number

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date


    // @ManyToOne(() => Firm,
    //             firm=>firm.incomes)   
    // @JoinColumn()
    // firm:Firm

}