// prisma/client.js
import { PrismaClient } from '@prisma/client'

// create one shared instance of PrismaClient
const prisma = new PrismaClient()

export default prisma
