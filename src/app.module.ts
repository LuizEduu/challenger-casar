import { Module } from '@nestjs/common'
import { HttpModule } from './domain/infra/http/http.module'

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
