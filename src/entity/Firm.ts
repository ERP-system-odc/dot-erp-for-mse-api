import { Entity, PrimaryGeneratedColumn, Column, BaseEntity,PrimaryColumn,OneToOne,JoinColumn, Double} from "typeorm"
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

    business_capital:number

    @PrimaryColumn({
        unique:true,
        length:9
        
       
    })
    tin_number:string

    @OneToOne(() => User)   
    @JoinColumn({
        
    })
    user: User

    

}