-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "entryPrice" REAL NOT NULL,
    "stopLoss" REAL NOT NULL,
    "takeProfit" REAL NOT NULL,
    "exitPrice" REAL,
    "riskAmount" REAL NOT NULL,
    "profitLoss" REAL,
    "riskReward" REAL,
    "result" TEXT,
    "emotions" TEXT,
    "entryReason" TEXT,
    "mistakes" TEXT,
    "whatWentRight" TEXT,
    "conclusions" TEXT,
    "entryScreenshot" TEXT,
    "exitScreenshot" TEXT,
    "extraScreenshots" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
