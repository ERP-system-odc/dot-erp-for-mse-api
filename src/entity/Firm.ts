import { Entity, PrimaryGeneratedColumn, Column,PrimaryColumn,OneToOne,JoinColumn,OneToMany} from "typeorm"
import { Expense } from "./Expense"
import { User } from "./User"


@Entity({name:"firms"})
export class Firm{

    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column({
        unique:true
    })
    business_name:string

   @Column({
    default:"Manufacturing"
   })
   business_type:string

    @Column()
    business_sub_type:string

    @Column({
        type:"double"
    })

    initial_capital:number

    @Column({
        type:"double"
    })

    current_capital:number

    @Column({
        unique:true,
        length:10
        
       
    })
    tin_number:string

    @OneToOne(() => User)   
    @JoinColumn({
        
    })
    user: User
    @OneToMany(()=>Expense,expense=>expense.firm)
    expenses:Expense[]

    
    

}
