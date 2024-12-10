import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { HttpModule } from './http/http.module'
import { EnvService } from './env/env.service'
import { EnvModule } from './env/env.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env), // faz a validação das envs e retorna um erro caso esteja faltando algo
      isGlobal: true,
    }),
    HttpModule,
    EnvModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
