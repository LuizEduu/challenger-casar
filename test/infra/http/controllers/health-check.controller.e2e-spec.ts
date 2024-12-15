import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Health check (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /health', async () => {
    const response = await request('http://nginx:8080').get('/health') // chama o nginx para validar que os servers estão ok

    expect(response.statusCode).toEqual(200)
    expect(response.text).toEqual('OK')
  })
})
