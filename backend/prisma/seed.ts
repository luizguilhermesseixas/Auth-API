import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const usersData = [
    {
      email: 'alice@example.com',
      password: 'senhaAlice123',
      firstName: 'Alice',
      lastName: 'Smith',
      address: {
        street: '123 Apple St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94101',
        country: 'USA',
      },
    },
    {
      email: 'bob@example.com',
      password: 'senhaBob123',
      firstName: 'Bob',
      lastName: 'Johnson',
      address: {
        street: '456 Banana Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
      },
    },
    {
      email: 'carol@example.com',
      password: 'senhaCarol123',
      firstName: 'Carol',
      lastName: 'Williams',
      address: {
        street: '789 Cherry Blvd',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
    },
    {
      email: 'dave@example.com',
      password: 'senhaDave123',
      firstName: 'Dave',
      lastName: 'Brown',
      address: {
        street: '321 Date Dr',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
      },
    },
    {
      email: 'eve@example.com',
      password: 'senhaEve123',
      firstName: 'Eve',
      lastName: 'Davis',
      address: {
        street: '654 Elderberry Ln',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA',
      },
    },
  ];

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: {
          create: {
            street: userData.address.street,
            city: userData.address.city,
            state: userData.address.state,
            zipCode: userData.address.zipCode,
            country: userData.address.country,
          },
        },
      },
    });
  }
  console.log('Seeded 5 users with addresses!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
