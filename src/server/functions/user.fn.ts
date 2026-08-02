import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { User } from "@/server/models/user.model";

// সব ইউজার লিস্ট আনা
export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const users = await User.find();
  console.log(users);
  return JSON.parse(JSON.stringify(users));
});

// নতুন ইউজার তৈরি
export const createUser = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
    })
  )
  .handler(async ({ data }) => {
    const newUser = await User.create(data);
    const obj: any = newUser.toObject ? newUser.toObject() : JSON.parse(JSON.stringify(newUser));

    return {
      ...obj,
      _id: String(obj._id),
      createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
      updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined,
    };
  });