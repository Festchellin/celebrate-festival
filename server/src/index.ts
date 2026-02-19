import express from 'express';
import cors from 'cors';
import http from 'https';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import shareRoutes from './routes/share';
import adminRoutes from './routes/admin';
import prisma from './utils/prisma';

const app = express();
const PORT = process.env.PORT || 3001;

const initAdminUser = async () => {
  const adminExists = await prisma.user.findUnique({
    where: { username: 'admin' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created: admin / 123456');
  }
};

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const isProduction = process.env.NODE_ENV === 'production';

const startServer = async () => {
  await initAdminUser();

  if (isProduction) {
    const sslOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH || './ssl/server.key'),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH || './ssl/server.crt'),
    };
    
    http.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`HTTPS Server is running on port ${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (HTTP - for development only)`);
    });
  }
};

startServer();
