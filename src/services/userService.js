import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { ErrorResponse } from '../response/errorResponse.js';
// import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const templateFilePathh = path.resolve(__dirname, '../views/resetPassword.html');
const templateFilePath = path.join(process.cwd(), 'src/views', 'resetPassword.html');
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

const emailController = (email) => {
  const mailOptions = {
    from: 'izzanabdul123@gmail.com',
    to: email,
    subject: 'Reset Password Email',
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions, (err, _info) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('success send email');
    }
  });
};

export class UserService {
  static async getAllUsers() {
    const allUsers = await prisma.user.findMany();

    if (allUsers.length === 0) {
      throw new ErrorResponse(404, 'Users not found.');
    }

    return allUsers;
  }

  static async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        Profile: true,
      },
    });

    if (!user) {
      throw new ErrorResponse(404, `User with ID: ${id} not found.`);
    }

    return user;
  }

  static async addImageProfile(userId, url, title, desc) {
    const userProfile = await prisma.profile.findFirst({
      where: {
        user_id: parseInt(userId),
      },
    });

    if (!userProfile) {
      throw new Error(`Profile for user ID ${userId} not found`);
    }

    const updatedProfile = await prisma.profile.update({
      where: {
        id: userProfile.id,
      },
      data: {
        image: url,
        title: title,
        description: desc,
      },
    });

    return updatedProfile;
  }

  static async sendToken(email) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    emailController(email);

    return token;
  }

  static async updatePassword(email, newPassword) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new ErrorResponse(404, `User with email: ${email} not found.`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return updatedUser;
  }
}
