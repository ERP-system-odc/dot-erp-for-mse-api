import { Entity, PrimaryGeneratedColumn, Column, BaseEntity,PrimaryColumn} from "typeorm"


@Entity({name:"users"})
export class User{

    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column()
    fullname:string

   @PrimaryColumn()
    email:string

    @PrimaryColumn()
    phonenumber:string

    @Column()
    password:string

    @Column()
    isadmin:string

}
