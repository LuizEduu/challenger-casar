import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  console.log('seeding database')

  const users: any = []

  for (let i = 0; i < 5; i++) {
    users.push({
      name: `userseed${i}`,
    })
  }

  await prisma.user.createMany({
    data: users,
  })

  const createdUsers = await prisma.user.findMany({
    where: {
      name: {
        in: users.map((u) => u.name),
      },
    },
  })

  const usersIds = createdUsers.map((u) => u.id.toString())

  console.log(`Created user IDs: ${usersIds.join(', ')}`)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
