import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { ErrorResponse } from '../response/errorResponse.js';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateFilePath = path.resolve(__dirname, '../views/register.html');
const templateSource = fs.readFileSync(templateFilePath, 'utf8');
const template = Handlebars.compile(templateSource);
const htmlToSend = template();

const transporter = nodemailer.createTransport({
  port: 465,
  secure: true,
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'izzanabdul123@gmail.com',
    pass: 'gxxr zgzg xqwu zsup',
  },
});

const prisma = new PrismaClient();

const emailController = (email) => {
  const mailOptions = {
    from: 'izzanabdul123@gmail.com',
    to: email,
    subject: 'test email',
    text: 'Ayo ayo ganyang fufufafa',
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('success send email');
    }
  });
};

export class AuthService {
  async register(data) {
    const checkUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (checkUser) {
      throw new ErrorResponse(409, 'Email already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        Profile: {
          create: {
            identity_type: data.identity_type,
            identity_number: data.identity_number,
            address: data.address,
          },
        },
      },
      include: {
        Profile: true,
      },
    });

    if (!newUser) {
      throw new ErrorResponse(500, 'User registration failed.');
    }

    emailController(data.email);

    return newUser;
  }

  async login(data) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new ErrorResponse(404, 'User not found.');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new ErrorResponse(400, 'Password is incorrect.');
    }

    const token = jwt.sign({ id: user.id }, 'asddas', {
      expiresIn: '1d',
    });

    return { token };
  }
}
