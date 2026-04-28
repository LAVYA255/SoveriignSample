import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // Provide a mock user for development
    ctx.user = {
      id: 1,
      unionId: "mock-admin-id",
      name: "Demo Admin",
      email: "admin@demo.com",
      avatar: null,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignInAt: new Date(),
      wallet: { balance: "1000000" }
    } as any;
  }
  return ctx;
}
