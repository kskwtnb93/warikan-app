import axios from "axios";

import { expect, test } from "@playwright/test";

test.describe("割り勘アプリ", () => {
  test.beforeEach(async ({ page }) => {
    await axios.get("http://localhost:3000/init");
    await page.goto("http://localhost:3001");
  });

  test("グループが作成され支出登録ページに遷移する", async ({ page }) => {
    const groupNameInput = page.getByLabel("グループ名");
    await groupNameInput.fill("group1");
    const memberListInput = page.getByLabel("メンバー");
    await memberListInput.fill("太朗, 花子");

    const submitButton = page.getByRole("button");
    await submitButton.click();

    await expect(page).toHaveURL(/.+\/group\/group1/);
  });

  test("バリデーションエラーが存在する場合グループが作成されずページ遷移しない", async ({
    page,
  }) => {
    const submitButton = page.getByRole("button");
    await submitButton.click();

    await expect(page.getByText("グループ名は必須です")).toBeVisible();
    await expect(page.getByText("メンバーは2人以上必要です")).toBeVisible();
    await expect(page).not.toHaveURL(/.+\/group\/group1/);
  });
});
