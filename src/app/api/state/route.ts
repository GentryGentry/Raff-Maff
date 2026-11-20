import { buildState } from "@/lib/server/actions";
import { route } from "@/lib/server/route";
export const dynamic = "force-dynamic";
export const GET = route(undefined, async ({ store, userId, name }) => buildState(store, userId, name));
