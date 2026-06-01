import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { sendSuccess } from '../../utils/responseHelper';
import { HTTP_STATUS } from '../../config/constants';
import { AppError, UnauthorizedError } from '../../utils/errors';

const generateToken = (userId: string): string => {
    const payload = { sub: userId };

    const secret: Secret = env.JWT_SECRET;

    const options: SignOptions = {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, secret, options);
};

// const setTokenCookie = (res: Response, token: string) => {
//     res.cookie('token', token, {
//         httpOnly: true,
//         secure: env.NODE_ENV === 'production',
//         sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });
// };

export const authController = {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError('User with this email already exists', HTTP_STATUS.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const token = generateToken(user.id);
        // setTokenCookie(res, token);

        // Exclude password from response
        const { password: _, ...userWithoutPassword } = user;

        sendSuccess(res, HTTP_STATUS.CREATED, 'User registered successfully', { user: userWithoutPassword, token });
    },

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedError();
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError();
        }

        const token = generateToken(user.id);
        // setTokenCookie(res, token);

        const { password: _, ...userWithoutPassword } = user;

        sendSuccess(res, HTTP_STATUS.OK, 'Login successful', { user: userWithoutPassword, token });
    },

    // async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         res.cookie('token', '', {
    //             httpOnly: true,
    //             expires: new Date(0),
    //             secure: env.NODE_ENV === 'production',
    //             sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    //         });
    //         sendSuccess(res, HTTP_STATUS.OK, 'Logout successful');
    //     } catch (error) {
    //         next(error);
    //     }
    // },
};
