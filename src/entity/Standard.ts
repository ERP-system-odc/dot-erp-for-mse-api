import { Entity, PrimaryGeneratedColumn, Column,ManyToOne,JoinColumn, OneToMany} from "typeorm"
import { Firm } from "./Firm"
import { StandardSetting } from "./StandardSettings"

@Entity({name:"standards"})
export class Standard{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    standard_name:string

  

    @ManyToOne(() => Firm,firm=>firm.standards)   
    @JoinColumn()
    firm:Firm

    @OneToMany(()=>StandardSetting,standard_setting=>standard_setting.standard)
    standard_settings:StandardSetting[]


}