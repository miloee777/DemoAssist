
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import axios from "axios";
import prisma from '@/lib/prisma'

import { replyNotification, replyNotificationPostback } from '@/utils/apiLineReply'
import _ from 'lodash'
import moment from 'moment';

type Data = {
    message: string;
    data?: any;
}
export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'PUT') {
        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).json({ message: 'error', error: "Content-Type must be application/json" })
        }
        try {
            const body = req.body

            if (!body.uId || !body.takecare_id || !body.latitude || !body.longitude) {
                return res.status(400).json({ message: 'error', data: 'ไม่พบพารามิเตอร์ uId, takecare_id, latitude, longitude, status, distance, battery' })
            }
            if (_.isNaN(Number(body.uId)) || _.isNaN(Number(body.takecare_id)) || _.isNaN(Number(body.status)) || _.isNaN(Number(body.distance)) || _.isNaN(Number(body.battery))) {
                return res.status(400).json({ message: 'error', data: 'พารามิเตอร์ uId, takecare_id, status, distance, battery ไม่ใช่ตัวเลข' })
            }
            const user = await prisma.users.findFirst({
                where: {
                    users_id: Number(body.uId)
                },
                include: { // ถ้าไม่ใส่ include จะไม่เอาข้อมูลจากตารางอื่นมาด้วย
                    users_status_id: {
                        select: {
                            status_name: true
                        }
                    }
                    // users_status_id: true, // ถ้าไม่ใส่ select จะเอาทุก field
                },
            })
            const takecareperson = await prisma.takecareperson.findFirst({
                where: {
                    takecare_id: Number(body.takecare_id),
                    takecare_status: 1
                }
            })

            if (user && takecareperson) {
                const safezone = await prisma.safezone.findFirst({
                    where: {
                        takecare_id: takecareperson.takecare_id as number,
                        users_id: user.users_id as number,
                    }
                })
                if (safezone) {
                    const location = await prisma.location.findFirst({
                        where: {
                            users_id: user.users_id as number,
                            takecare_id: takecareperson.takecare_id as number,
                        },
                        orderBy: {
                            locat_timestamp: 'desc'
                        }
                    }) // ดึงข้อมูลล่าสุด

                    const status = Number(body.status)
               
                    let noti_time = null
                    let noti_status = null

                    
                    if (location) {
                        if (status === 1) {
                            noti_time = new Date()
                            if (!location?.locat_noti_time && !location?.locat_noti_status) {
                                const message = `คุณ ${takecareperson.takecare_fname} ${takecareperson.takecare_sname} \nออกนอก Safezone ชั้นที่ 1 แล้ว`
                                await replyNotification({ replyToken: user.users_line_id, message })
                                noti_status = 1
                            } else {
    
                                const distance = (Number(safezone.safez_radiuslv1) * 0.8)
                                const checkTime = location.locat_noti_status === 2 && moment().diff(moment(location.locat_noti_time), 'minutes') >= 5 ? true : false
                
                                if (Number(body.distance) >= distance) {
                                        noti_status = 2
                                        noti_time = location.locat_noti_time
                                        const message = `คุณ ${takecareperson.takecare_fname} ${takecareperson.takecare_sname} \nเข้าใกล้ Safezone ชั้นที่ 2 แล้ว`
                                        if(location.locat_noti_status === 1){
                                            await replyNotification({ replyToken: user.users_line_id, message })
                                        }else if(location.locat_noti_status === 2 && checkTime){
                                            await replyNotification({ replyToken: user.users_line_id, message })
                                            noti_time = new Date()
                                        }
                                      
                                }
                            }
                           
    
                        } else if (status === 2) {
                            const message = `คุณ ${takecareperson.takecare_fname} ${takecareperson.takecare_sname} \nออกนอกเขต Safezone ชั้นที่ 2 แล้ว`
                            const checkTime = location?.locat_noti_status === 3 && moment().diff(moment(location.locat_noti_time), 'minutes') >= 5 ? true : false
                            const params = {
                                replyToken      : user.users_line_id,
                                userId          : user.users_id,
                                takecarepersonId: takecareperson.takecare_id,
                                type            : 'safezone',
                                message
                            }
                            noti_status = 3
                            noti_time = location?.locat_noti_time
                            if(location?.locat_noti_status === 2 || location?.locat_noti_status === 1){
                                await replyNotificationPostback(params)
                                noti_time = new Date()
                            }
                            // if(location?.locat_noti_status === 2){
                            //     await replyNotificationPostback(params)
                            //     noti_time = new Date()
                            // }else if(location?.locat_noti_status === 3 && checkTime){
                            //     await replyNotificationPostback(params)
                            //     noti_time = new Date()
                            // }
                        }
                        await prisma.location.update({
                            where: {
                                location_id: location.location_id as number,
                            },
                            data: {
                                locat_timestamp  : new Date(),
                                locat_latitude   : body.latitude,
                                locat_longitude  : body.longitude,
                                locat_status     : status,
                                locat_distance   : Number(body.distance),
                                locat_battery    : Number(body.battery),
                                locat_noti_time  : noti_time,
                                locat_noti_status: noti_status,
                            },
                        })

                    } else {
                        await prisma.location.create({
                            data: {
                                users_id: user.users_id,
                                takecare_id: takecareperson.takecare_id,
                                locat_timestamp: new Date(),
                                locat_latitude: body.latitude,
                                locat_longitude: body.longitude,
                                locat_status: status,
                                locat_distance: Number(body.distance),
                                locat_battery: Number(body.battery),
                            },
                        })
                    }

                    return res.status(200).json({ message: 'success', data: 'บันทึกข้อมูลเรียบร้อย' })
                }
                return res.status(200).json({ message: 'error', data: 'ไม่พบข้อมูล safezone' })
            } else {
                return res.status(200).json({ message: 'error', data: 'ไม่พบข้อมูล user หรือ takecareperson' })
            }
        } catch (error) {
            console.log("🚀 ~ file: create.ts:31 ~ handle ~ error:", error)
            return res.status(400).json({ message: 'error', data: error })
        }

    }else if(req.method === 'POST'){
        const body = req.body
        console.log("🚀 ~ handle ~ body:", body)
    } else {
        res.setHeader('Allow', ['PUT'])
        res.status(400).json({ message: `วิธี ${req.method} ไม่อนุญาต` })
    }

}
