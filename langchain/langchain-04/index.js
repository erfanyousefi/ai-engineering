import "dotenv/config";
import {chain} from "./chain.js";

const customerMessage = `
من عرفان هستم از مشتری های قدیمی شما و سه روزه که پنل کاربری من کار نمیکنه نه اس ام اس میره و نه لایسنس ایجاد میشه
 و دارم مشتری هام رو از دست میدم،
 سریع تر یک کاری کنید که پنلم درست بشه وگرنه اشتراکم رو لغو میکنم
`;

const result = await chain.invoke({message: customerMessage});

console.log(result);
