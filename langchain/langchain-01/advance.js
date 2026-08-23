import {z} from "zod";

const ticketSchema = z.object({
  title: z.string().min(5).max(100).describe("عنوان کوتاه و مختصر باشد"),
  category: z.enum(["فنی", "مالی", "پشتیبانی", "انتقادات"]).describe("دسته بندی اصلی تیکت"),
  priority: z
    .enum(["زیاد", "کم", "متوسط", "بحرانی"])
    .describe("اولیت پاسخ گویی بر اساس فوریت مسئله"),
  tags: z.array(z.string()).max(5).describe("حداکثر ۵ برچشب کلیدی"),
  needs_manager: z.boolean().describe(),
});

const validTicket = ticketSchema.safeParse({
  title: "خرابی پنل کاربری",
  category: "فنی",
  priority: "زیاد",
  tags: ["پنل", "خرابی"],
  needs_manager: true,
});



const contactSchema = z.object({
    name: z.string().min(3).max(50),
    phone: z.string().regex().optional(),
    email: z.string().email()
})