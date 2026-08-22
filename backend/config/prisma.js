require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { neonConfig } = require('@neondatabase/serverless');
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

const globalForPrisma = globalThis;

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
const adapterFactory = new PrismaNeon({ connectionString });
let connectedAdapterPromise;

async function getAdapter() {
  if (!connectedAdapterPromise) {
    connectedAdapterPromise = adapterFactory.connect().then((connected) => {
      const adapter = {
        adapterName: connected.adapterName,
        provider: connected.provider,
        queryRaw: connected.queryRaw.bind(connected),
        executeRaw: connected.executeRaw.bind(connected),
        executeScript: connected.executeScript.bind(connected),
        dispose: connected.dispose.bind(connected),
        startTransaction: connected.startTransaction.bind(connected),
        getConnectionInfo: connected.getConnectionInfo?.bind(connected),
      };

      adapter.transactionContext = async () => adapter;
      return adapter;
    });
  }

  return connectedAdapterPromise;
}

const adapter = {
  adapterName: adapterFactory.adapterName,
  provider: adapterFactory.provider,
  connect: async () => getAdapter(),
};

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
