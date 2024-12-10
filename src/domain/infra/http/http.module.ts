import { Module } from '@nestjs/common'
import { HealthController } from './controllers/health-check.controller'

@Module({
  controllers: [HealthController],
  providers: [],
  imports: [],
})
export class HttpModule {}
