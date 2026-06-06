import { describe, it, expect, vi, beforeEach } from "vitest";

describe("getModel and getChatModel with API key", () => {
  beforeEach(() => {
    vi.stubEnv("GEMINI_API_KEY", "test-api-key");
    vi.resetModules();
  });

  it("returns model when GEMINI_API_KEY is present", async () => {
    const { getModel, getChatModel } = await import("./gemini");
    const model = getModel();
    const chatModel = getChatModel();
    expect(model).not.toBeNull();
    expect(chatModel).not.toBeNull();
  });
});
