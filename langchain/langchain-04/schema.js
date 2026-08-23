import {z} from "zod";

export const schema = z.object({
  topic: z.string().describe("موضوع اصلی متن در یک عبارت کوتاه"),
  sentiment: z.enum(["خنثی", "منفی", "مثبت"]).describe("احساس کلی مشتری"),
  urgency: z.enum(["زیاد", "متوسط", "کم"]).describe("میزان فوریت پیام"),
  keywords: z.array(z.string()).max(5).describe("حداکثر ۵ کلیدواژه "),
  suggested_action: z.string().describe("اقدام پیشنهادی برای تیم پشتیبانی"),
});
