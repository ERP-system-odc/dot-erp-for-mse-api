import { Entity, PrimaryGeneratedColumn, Column,PrimaryColumn,OneToOne,JoinColumn,OneToMany} from "typeorm"
import { Expense } from "./Expense"
import { InventoryType } from "./InventoryType"
import { User } from "./User"
import { Standard } from "./Standard"


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

    @OneToMany(()=>InventoryType,inventory_type=>inventory_type.firm)
    inventory_types:InventoryType[]
    @OneToMany(()=>Standard,standard=>standard.firm)
    standards:Standard[]
    

    
    

}
