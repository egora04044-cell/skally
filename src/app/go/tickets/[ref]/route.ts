import { NextResponse } from "next/server";

import {
  TICKET_ALLOWED_HOSTS,
  resolveTicketHttpsUrl,
} from "@/content/ticket-destinations";
import { assertHttpsTicketUrl, TICKET_REF_SAFE } from "@/lib/ticket-url";

/** Безопасный редирект на оператора билетов: только whitelist + https, без произвольного url из запроса. */
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

  assertHttpsTicketUrl(target, TICKET_ALLOWED_HOSTS);
  return NextResponse.redirect(target, 302);
}
