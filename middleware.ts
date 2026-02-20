// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Transaction {
  id         String   @id @default(cuid())
  type       String   // "income" or "expense"
  amount     Float
  currency   String   @default("RUB")
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  accountId  String?
  account    Account? @relation(fields: [accountId], references: [id])
  date       DateTime
  comment    String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Category {
  id           String        @id @default(cuid())
  name         String
  icon         String?
  color        String?
  isDefault    Boolean       @default(false)
  type         String        @default("expense") // "income" or "expense"
  expenseType  String        @default("variable") // "mandatory", "variable", "discretionary" - only for expense
  transactions Transaction[]
  budgets      Budget[]
  regularPayments RegularPayment[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Budget {
  id         String   @id @default(cuid())
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  amount     Float
  currency   String   @default("RUB")
  month      String   // Format: "YYYY-MM"
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([categoryId, month])
}

model RegularPayment {
  id         String   @id @default(cuid())
  name       String
  amount     Float
  currency   String   @default("RUB")
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  period     String   // "daily", "weekly", "monthly", "yearly"
  dueDate    Int?     // Day of month (1-31) for monthly payments
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Settings {
  id              String   @id @default(cuid())
  rubToUsdRate    Float    @default(0.011)
  theme           String   @default("light")
  // Income distribution rules (percentages)
  mandatoryPercent   Float @default(50)
  variablePercent    Float @default(30)
  savingsPercent     Float @default(10)
  investmentsPercent Float @default(10)
  // Authentication
  passwordHash     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Financial Accounts (main, savings, cash, investments)
model Account {
  id           String        @id @default(cuid())
  name         String
  type         String        // "main", "savings", "cash", "investment"
  currency     String        @default("RUB")
  balance      Float         @default(0)
  color        String?
  icon         String?
  isActive     Boolean       @default(true)
  transactions Transaction[]
  goals        FinancialGoal[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

// Financial Goals
model FinancialGoal {
  id             String   @id @default(cuid())
  name           String
  targetAmount   Float
  currentAmount  Float    @default(0)
  currency       String   @default("RUB")
  deadline       DateTime?
  accountId      String?
  account        Account? @relation(fields: [accountId], references: [id])
  isCompleted    Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

// Investments (not linked to accounts - manual tracking)
model Investment {
  id             String   @id @default(cuid())
  type           String   // "deposit", "withdraw", "adjustment"
  amount         Float
  description    String?
  date           DateTime
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
