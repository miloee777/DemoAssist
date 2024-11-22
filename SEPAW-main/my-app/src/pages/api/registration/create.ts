import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // เพิ่ม header สำหรับ CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // ตรวจสอบและตอบกลับ preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            if (req.body) {
                const body = req.body
                await prisma.users.create({
                    data: {
                        users_line_id      : body.users_line_id,
                        users_fname        : body.users_fname,
                        users_sname        : body.users_sname,
                        users_passwd       : body.users_passwd,
                        users_pin          : Number(body.users_pin),
                        status_id          : body.status_id,
                        users_alert_battery: 0,
                        users_status_active: 1,
                        users_number       : body.users_number,
                        users_moo          : body.users_moo,
                        users_road         : body.users_road,
                        users_tubon        : body.users_tubon,
                        users_amphur       : body.users_amphur,
                        users_province     : body.users_province,
                        users_postcode     : body.users_postcode,
                        users_tel1         : body.users_tel1,
                    },
                })
            }
            return res.status(200).json({ message: 'success' })
        } catch (error) {
            console.log("🚀 ~ file: create.ts ~ handle ~ error:", error)
            return res.status(400).json({ message: 'error', data: error })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).json({ message: `วิธี ${req.method} ไม่อนุญาต` })
    }
}
