// prisma/client.js
import { PrismaClient } from "../generated/prisma/index.js";

// create one shared instance of PrismaClient
const prisma = new PrismaClient();

export default prisma;
