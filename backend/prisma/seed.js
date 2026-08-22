require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const bcrypt = require('bcrypt');
const { neonConfig } = require('@neondatabase/serverless');
const { PrismaClient, Prisma } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

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

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const tx = prisma;

    await tx.salarySlip.deleteMany();
    await tx.payroll.deleteMany();
    await tx.notification.deleteMany();
    await tx.auditLog.deleteMany();
    await tx.aiException.deleteMany();
    await tx.document.deleteMany();
    await tx.leaveRequest.deleteMany();
    await tx.leaveBalance.deleteMany();
    await tx.attendanceRecord.deleteMany();
    await tx.employeeProfile.deleteMany();
    await tx.leaveType.deleteMany();
    await tx.user.deleteMany();

    const leaveTypes = [];
    leaveTypes.push(await tx.leaveType.create({
      data: {
        name: 'Casual',
        code: 'CL',
        description: 'Casual leave for short personal needs',
        annualAllocation: new Prisma.Decimal(12),
        isPaid: true,
      },
    }));
    leaveTypes.push(await tx.leaveType.create({
      data: {
        name: 'Sick',
        code: 'SL',
        description: 'Sick leave for illness',
        annualAllocation: new Prisma.Decimal(8),
        isPaid: true,
      },
    }));
    leaveTypes.push(await tx.leaveType.create({
      data: {
        name: 'Earned',
        code: 'EL',
        description: 'Earned leave accrued through service',
        annualAllocation: new Prisma.Decimal(18),
        isPaid: true,
      },
    }));

    const hrUsers = [];
    hrUsers.push(await tx.user.create({
      data: {
        employeeId: 'HR001',
        email: 'admin@yourcompany.example.com',
        passwordHash,
        role: 'hr',
        profile: {
          create: {
            fullName: 'Aarav Menon',
            department: 'People Operations',
            designation: 'HR Manager',
            dateOfJoining: new Date('2023-01-15'),
          },
        },
      },
    }));
    hrUsers.push(await tx.user.create({
      data: {
        employeeId: 'HR002',
        email: 'jeffrey.kelly72@example.com',
        passwordHash,
        role: 'hr',
        profile: {
          create: {
            fullName: 'Nisha Rao',
            department: 'People Operations',
            designation: 'HR Executive',
            dateOfJoining: new Date('2024-04-01'),
          },
        },
      },
    }));

    const employees = [];
    employees.push(await tx.user.create({
      data: {
        employeeId: 'EMP001',
        email: 'mark.brown23@example.com',
        passwordHash,
        role: 'employee',
        profile: {
          create: {
            fullName: 'Alice Johnson',
            department: 'Engineering',
            designation: 'Frontend Developer',
            dateOfJoining: new Date('2024-06-01'),
          },
        },
      },
    }));
    employees.push(await tx.user.create({
      data: {
        employeeId: 'EMP00abi2',
        email: 'gail.peterson39@example.com',
        passwordHash,
        role: 'employee',
        profile: {
          create: {
            fullName: 'Bob Singh',
            department: 'Engineering',
            designation: 'Backend Developer',
            dateOfJoining: new Date('2024-05-15'),
          },
        },
      },
    }));
    employees.push(await tx.user.create({
      data: {
        employeeId: 'EMP003',
        email: 'audrey.peterson25@example.com',
        passwordHash,
        role: 'employee',
        profile: {
          create: {
            fullName: 'Charlie Patel',
            department: 'Design',
            designation: 'UI Designer',
            dateOfJoining: new Date('2024-07-10'),
          },
        },
      },
    }));
    employees.push(await tx.user.create({
      data: {
        employeeId: 'EMP004',
        email: 'anita.oliver32@example.com',
        passwordHash,
        role: 'employee',
        profile: {
          create: {
            fullName: 'Diana Thomas',
            department: 'Finance',
            designation: 'Accountant',
            dateOfJoining: new Date('2024-03-18'),
          },
        },
      },
    }));
    employees.push(await tx.user.create({
      data: {
        employeeId: 'EMP005',
        email: 'tina.williamson98@example.com',
        passwordHash,
        role: 'employee',
        profile: {
          create: {
            fullName: 'Ethan Varma',
            department: 'Operations',
            designation: 'Operations Associate',
            dateOfJoining: new Date('2024-08-05'),
          },
        },
      },
    }));
    employees.push(await tx.user.create({
      data: {
        employeeId: 'EMP006',
        email: 'sharlene.rhodes49@example.com',
        passwordHash,
        role: 'employee',
        profile: {
          create: {
            fullName: 'Fatima Khan',
            department: 'Support',
            designation: 'Customer Support',
            dateOfJoining: new Date('2024-09-01'),
          },
        },
      },
    }));

    const year = 2026;

    for (const employee of employees) {
      for (const leaveType of leaveTypes) {
        await tx.leaveBalance.create({
          data: {
            userId: employee.id,
            leaveTypeId: leaveType.id,
            year,
            allocated: leaveType.annualAllocation,
            used: new Prisma.Decimal(0),
          },
        });
      }
    }

    for (const [index, employee] of employees.entries()) {
      await tx.payroll.create({
        data: {
          userId: employee.id,
          year,
          month: 8,
          baseSalary: new Prisma.Decimal(50000 + index * 4000),
          allowances: new Prisma.Decimal(5000),
          deductions: new Prisma.Decimal(1200),
          netPay: new Prisma.Decimal(50000 + index * 4000 + 5000 - 1200),
          status: 'draft',
          salarySlip: {
            create: {
              slipNumber: `SLIP-2026-08-${String(index + 1).padStart(2, '0')}`,
              fileUrl: null,
            },
          },
        },
      });
    }

    await tx.notification.create({
      data: {
        userId: employees[0].id,
        type: 'system',
        title: 'Welcome to Dayflow',
        body: 'Your demo account is ready. Use Password123! to sign in.',
      },
    });

    await tx.aiException.createMany({
      data: [
        {
          userId: employees[0].id,
          severity: 'medium',
          status: 'open',
          category: 'attendance',
          title: 'Repeated late check-ins',
          description: 'Demo exception for HR review',
          evidence: {
            source: 'seed',
            count: 3,
          },
          deterministicFacts: {
            lateDays: 3,
            window: 'last_7_days',
          },
          reportedById: hrUsers[0].id,
        },
        {
          userId: employees[1].id,
          severity: 'high',
          status: 'investigating',
          category: 'leave',
          title: 'Leave balance mismatch',
          description: 'Seeded issue for testing the exceptions endpoint',
          evidence: {
            source: 'seed',
            daysRequested: 5,
          },
          deterministicFacts: {
            balanceType: 'Casual',
            requestedDays: 5,
          },
          reportedById: hrUsers[1].id,
        },
      ],
    });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
