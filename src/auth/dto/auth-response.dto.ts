import { Tenant } from "src/entities/tenant.entity";
import { TenantUser } from "src/entities/tenant-user.entity";


export class AuthResponseDto { 
    user : Omit<TenantUser , 'password' > ;
    accessToken : string ;
}
