import { NextRequest } from "next/server";
import { successResponse, validationError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return validationError("Name, email, and password are required");
    }

    // Demo mode: just return success without DB
    return successResponse({ message: "Account created successfully" }, 201);
  } catch {
    return validationError("Invalid request body");
  }
}
