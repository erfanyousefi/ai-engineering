import {z} from "zod";

const nameSchema = z.string();
console.log("string: ", nameSchema.parse("erfan"));
const parseResult = nameSchema.safeParse(1234);

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.email(),
});

const result = userSchema.safeParse({
  name: "Erfan",
  age: 30,
  email: "erfan@gmail.com",
});
console.log(result);

const tagSchema = z.array(z.string()).min(2).max(5);
const tagResult = tagSchema.safeParse(["q", "d"]);
console.log(tagResult);

const roleSchema = z.enum(["admin", "user", "student", "teacher"]);
const roleResult = roleSchema.safeParse("admin");
console.log(roleResult);

const passSchema = z
  .string()
  .min(8, "حداقل ۸ کاراکتر")
  .max(20, "حداکثر ۲۰ کاراکتر")
const passResult = passSchema.safeParse("  12345678abcDE  ");
console.log(passResult);
