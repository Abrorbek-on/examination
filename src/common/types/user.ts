import { User } from "@prisma/client";

export type TAuthUser = Omit<User,
'password'>;