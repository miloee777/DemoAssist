import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma'
// import { matchPassword } from '@/utils/helpers'
import { compare, genSalt, hash } from 'bcrypt';

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY environment variable is not set');
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(401).json({ message: 'Username and password are required' });
        }
        try {
            // genSalt(8, (err, salt) => {
            //     if (err) {
            //         throw new Error('Error in genSalt');
            //     }
            //     hash(password, salt, async (err, hash) => {
            //         if (err) {
            //             throw new Error('Error in hash');
            //         }
            //         console.log(hash);
            //     });
            // });
           const user = await prisma.users.findFirst({
                where: {
                    users_user         : username,
                    status_id          : 3,
                    users_status_onweb : 1,
                    users_status_active: 1
                }
            })

            if (!user) {
                return res.status(401).json({ message: 'Username หรือ Password ไม่ถูกต้อง' });
            }
            const isPasswordMatch = await matchPassword(user.users_passwd, password);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: 'User หรือ Password ไม่ถูกต้อง' });
            }

            const accessToken = jwt.sign({ 
                userName  : user.users_user,
                userId    : user.users_id,
                permission: user.status_id
             }, SECRET_KEY, { expiresIn: '1h' });

            return res.status(200).json({ 
                message: 'Success',
                user: {
                    userName  : user.users_user,
                    userId    : user.users_id,
                    permission: user.status_id
                },
                accessToken 
            });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
};

export const matchPassword = async (oldPassword: string, password: string): Promise<boolean> => {
    return compare(password, oldPassword);
};