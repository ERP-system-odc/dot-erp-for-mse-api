import { Entity, PrimaryGeneratedColumn, Column, BaseEntity,PrimaryColumn} from "typeorm"


@Entity({name:"users"})
export class User{

    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column()
    full_name:string

   @Column({
    unique:true
   })
    email:string

    @Column({
    unique:true
    }    
    )
    phone_number:string

    @Column()
    password:string

    @Column({
        default:false
    })
    is_admin:boolean

    @Column({
        default:true
    })
    is_starter:boolean

}
