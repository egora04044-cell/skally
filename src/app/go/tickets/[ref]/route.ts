import { NextResponse } from "next/server";

import { resolveTicketHttpsUrl } from "@/content/ticket-destinations";
import { assertHttpsTicketUrl, TICKET_REF_SAFE } from "@/lib/ticket-url";

/** Редирект на оператора билетов: только зарегистрированный `ref` → HTTPS URL из `ticket-destinations.ts`. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ ref: string }> },
): Promise<Response> {
  const { ref: refParam } = await context.params;
  const decoded = decodeURIComponent(refParam);
  if (!TICKET_REF_SAFE.test(decoded)) {
    return new NextResponse(null, { status: 404 });
  }

  const target = resolveTicketHttpsUrl(decoded);
  if (!target) {
    return new NextResponse(null, { status: 404 });
  }

  assertHttpsTicketUrl(target);
  return NextResponse.redirect(target, 302);
}
