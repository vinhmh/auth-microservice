import { Controller, Get } from '@nestjs/common';
import{AuthService} from '../auth-service';
@Controller('auth-controller')
export class AuthControllerController {
    constructor (private readonly service: AuthService){}
    @Get()
    getUser(){
        return this.service.getUser()
    }
}
