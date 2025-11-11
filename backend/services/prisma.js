const { PrismaClient } = require("@prisma/client");
// const logger = require("../logger");

const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: [
    { emit: "stdout", level: "error" },
    { emit: "stdout", level: "warn" },
  ],
});

// Databse query logs
// prisma.$on("warn", (e) => logger("warn", e));
// prisma.$on("error", (e) => logger("error", e));

module.exports = prisma;
