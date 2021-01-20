import { Module } from '@nestjs/common';
import { AuthControllerController } from './auth-controller/auth-controller.controller';
import { AuthService } from './auth-service';

@Module({
  controllers: [AuthControllerController],
  providers: [AuthService]
})
export class AuthModuleModule {}
