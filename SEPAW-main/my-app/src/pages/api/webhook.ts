import { NextApiRequest, NextApiResponse } from "next";
import {
  replyMessage,
  replyRegistration,
  replyMenuBorrowequipment,
  replyUserInfo,
  replyNotRegistration,
  replyLocation,
  replySetting,
} from "@/utils/apiLineReply";
import { getUser, getTakecareperson, getSafezone, getLocation } from "@/lib/listAPI";

// Webhook handler
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const events = req.body.events?.[0];
    if (!events) {
      return res.status(400).json({ message: "No event found in the request" });
    }

    const { replyToken, source, type, message } = events;
    const userId = source?.userId;

    if (!replyToken || !userId) {
      return res.status(400).json({ message: "Missing replyToken or userId" });
    }

    if (type === "message" && message?.type === "text") {
      const userMessage = message.text;

      switch (userMessage) {
        case "ลงทะเบียน": {
          const userData = await safeApiCall(() => getUser(userId));
          if (userData) {
            await replyUserInfo({ replyToken, userData });
          } else {
            await replyRegistration({ replyToken, userId });
          }
          break;
        }

        case "การยืม การคืนครุภัณฑ์": {
          const userData = await safeApiCall(() => getUser(userId));
          if (userData) {
            await replyMenuBorrowequipment({ replyToken, userData });
          } else {
            await replyNotRegistration({ replyToken, userId });
          }
          break;
        }

        case "ดูตำแหน่งปัจจุบัน": {
          const userData = await safeApiCall(() => getUser(userId));
          if (userData) {
            const encodedUserId = encodeURIComponent(userData.users_id);
            const takecareperson = await safeApiCall(() =>
              getTakecareperson(encodedUserId)
            );
            if (takecareperson && takecareperson.takecare_id) {
              const safezone = await safeApiCall(() =>
                getSafezone(takecareperson.takecare_id, userData.users_id)
              );
              const location = await safeApiCall(() =>
                getLocation(
                  takecareperson.takecare_id,
                  userData.users_id,
                  safezone?.safezone_id
                )
              );
              await replyLocation({
                replyToken,
                userData,
                userTakecarepersonData: takecareperson,
                safezoneData: safezone,
                locationData: location,
              });
            } else {
              await replyMessage({
                replyToken,
                message: "ยังไม่ได้เพิ่มข้อมูลผู้สูงอายุ ไม่สามารถดูตำแหน่งได้",
              });
            }
          } else {
            await replyNotRegistration({ replyToken, userId });
          }
          break;
        }

        case "ตั้งค่าเขตปลอดภัย": {
          const userData = await safeApiCall(() => getUser(userId));
          if (userData) {
            const encodedUserId = encodeURIComponent(userData.users_id);
            const takecareperson = await safeApiCall(() =>
              getTakecareperson(encodedUserId)
            );
            if (takecareperson && takecareperson.takecare_id) {
              const safezone = await safeApiCall(() =>
                getSafezone(takecareperson.takecare_id, userData.users_id)
              );
              await replySetting({
                replyToken,
                userData,
                userTakecarepersonData: takecareperson,
                safezoneData: safezone,
              });
            } else {
              await replyMessage({
                replyToken,
                message: "ไม่พบข้อมูลผู้สูงอายุ ไม่สามารถตั้งค่าเขตปลอดภัยได้",
              });
            }
          } else {
            await replyNotRegistration({ replyToken, userId });
          }
          break;
        }

        default: {
          await replyMessage({ replyToken, message: "คำสั่งไม่ถูกต้อง" });
          break;
        }
      }
    } else {
      await replyMessage({
        replyToken,
        message: "ประเภทข้อความนี้ยังไม่รองรับ",
      });
    }

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Safe API Call wrapper for error handling
async function safeApiCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error("Error during API call:", error);
    return null;
  }
}
