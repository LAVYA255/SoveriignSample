import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";

import { env } from "./lib/env";
const BACKEND_URL = "http://127.0.0.1:3001";
console.log('[auth-router] BACKEND_URL loaded as:', BACKEND_URL);

import { z } from "zod";

export const authRouter = createRouter({
  upsertSync: publicQuery
    .input(z.object({ id: z.string().optional(), email: z.string(), username: z.string(), passwordHash: z.string().nullable().optional() }))
    .mutation(async ({ input }) => {
      console.log('[auth-router] upsertSync called with:', input.email);
      const response = await fetch(`${BACKEND_URL}/api/auth/upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: input.id,
          email: input.email,
          username: input.username,
          passwordHash: input.passwordHash
        })
      });
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return result.data; // full user object
    }),
  me: authedQuery.query(async (opts) => {
    const user = opts.ctx.user;
    if (user) {
      // Upsert user in Supabase
      try {
        await fetch(`${BACKEND_URL}/api/auth/upsert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            username: (user as any).username || user.name
          })
        });
      } catch (err) {
        console.error('Failed to upsert user in Supabase', err);
      }
    }
    return user;
  }),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
