import { successResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Demo mode: just return the preferences back without saving to DB
    return successResponse({
      ...body,
      saved: true,
    });
  } catch {
    return successResponse({ saved: true });
  }
}
