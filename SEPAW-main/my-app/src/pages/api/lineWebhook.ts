import { NextApiRequest, NextApiResponse } from 'next';
import { replyMessage } from '@/utils/apiLineReply';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const events = req.body.events;

      if (events.length > 0) {
        for (const event of events) {
          if (event.type === 'message' && event.message.type === 'text') {
            // Reply to message
            await replyMessage({
              replyToken: event.replyToken,
              message: `คุณส่งข้อความว่า: ${event.message.text}`,
            });
          }
        }
      }

      res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('Error handling webhook:', error);
      if (error instanceof Error) {
        res.status(500).json({ status: 'error', message: error.message });
      } else {
        res.status(500).json({ status: 'error', message: 'Unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
