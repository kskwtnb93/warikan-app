import axios from "axios";

import { expect, test } from "@playwright/test";

test.describe("割り勘アプリ", () => {
  test.beforeEach(async ({ page }) => {
    await axios.get("http://localhost:3000/init");
    await page.goto("http://localhost:3001");
  });
});
