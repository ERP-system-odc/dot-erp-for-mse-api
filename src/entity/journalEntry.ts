import { Entity, PrimaryGeneratedColumn, Column,JoinColumn,CreateDateColumn, ManyToOne} from "typeorm"
import { Firm } from "./Firm"

@Entity({name:"journal_entry"})
export class JournalEntry{

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    created_at:Date

    @Column()
    account:string

    @Column({
        type:"double"
    })
    debit:number

    @Column({
        type:"double"
    })
    credit:number
    
    @Column({})
    transaction_reason:string

    @Column({
        select:false
    })
    transaction_type:string

     @ManyToOne(() => Firm,
                firm=>firm.journal_entry)   
    @JoinColumn()
    firm:Firm  

}