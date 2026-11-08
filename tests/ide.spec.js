const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  // Keep UI/worker integration tests deterministic. The Python runtime itself
  // is covered by the worker's own checks; this fake worker exercises the app
  // message protocol without downloading Pyodide in every browser test.
  await page.addInitScript(() => {
    window.Worker = class TestWorker {
      constructor() {
        this.onmessage = null;
        this.onerror = null;
      }
      postMessage(message) {
        window.setTimeout(() => {
          if (!this.onmessage) return;
          if (message.code.includes("__TEST_ERROR__")) {
            this.onmessage({
              data: { id: message.id, type: "error", text: "Simulated Python error" }
            });
            return;
          }
          this.onmessage({
            data: { id: message.id, type: "status", message: "Python ready" }
          });
          this.onmessage({
            data: { id: message.id, type: "stdout", text: "Browser test output\\n" }
          });
          this.onmessage({ data: { id: message.id, type: "done" } });
        }, 0);
      }
      terminate() {}
    };
  });
});

test("playground editor supports editing, autosave, execution and reset", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-view="playground"]').click();
  await expect(page.locator(".CodeMirror")).toBeVisible();

  const initialCode = await page.locator("#codeEditor").evaluate(el => el.CodeMirror.getValue());
  await page.locator("#codeEditor").evaluate(el => {
    el.CodeMirror.setValue('print("Browser test")');
  });

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("pythonPathProgress")));
  expect(saved.drafts.playground).toBe('print("Browser test")');

  await page.locator(".run-code").click();
  await expect(page.locator("#codeOutput")).toContainText("Browser test output");
  await expect(page.locator("#runStatus")).toHaveText("Execution finished");

  await page.locator(".reset-code").click();
  await expect.poll(() => page.locator("#codeEditor").evaluate(el => el.CodeMirror.getValue()))
    .toBe(initialCode);
  const afterReset = await page.evaluate(() => JSON.parse(localStorage.getItem("pythonPathProgress")));
  expect(afterReset.drafts.playground).toBeUndefined();
});

test("playground displays worker errors instead of leaving a running state", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-view="playground"]').click();
  await expect(page.locator(".CodeMirror")).toBeVisible();
  await page.locator("#codeEditor").evaluate(el => el.CodeMirror.setValue("__TEST_ERROR__"));
  await page.locator(".run-code").click();

  await expect(page.locator("#codeOutput")).toContainText("Simulated Python error");
  await expect(page.locator("#codeOutput")).toHaveClass(/error/);
  await expect(page.locator("#runStatus")).toHaveText("Execution failed");
});

test("lesson challenge saves edits, reports a pass and resets cleanly", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-view="lessons"]').click();
  await page.locator('[data-lesson="intro"]').click();
  await expect(page.locator(".challenge-ide .CodeMirror")).toBeVisible();

  await page.locator("#challengeEditor").evaluate(el => {
    el.CodeMirror.setValue('greeting = "Hello, Python!"\\nprint(greeting)');
  });
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("pythonPathProgress")));
  expect(saved.drafts["challenge:intro"]).toContain("Hello, Python!");

  await page.locator("#checkChallenge").click();
  await expect(page.locator("#challengeResult")).toHaveClass(/pass/);
  await expect(page.locator("#challengeResult")).toContainText("All tests passed");
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("pythonPathProgress")).challengeResults.intro))
    .toBe(true);

  await page.locator("#resetChallenge").click();
  const reset = await page.evaluate(() => JSON.parse(localStorage.getItem("pythonPathProgress")));
  expect(reset.drafts["challenge:intro"]).toBeUndefined();
  await expect(page.locator("#challengeResult")).not.toHaveClass(/visible/);
});

test("plain textarea fallback remains usable when CodeMirror CDN is unavailable", async ({ page }) => {
  await page.route("**/codemirror/**", route => route.abort());
  await page.goto("/");
  await page.locator('[data-view="playground"]').click();
  await expect(page.locator("#codeEditor")).toBeVisible();
  await page.locator("#codeEditor").fill('print("Fallback works")');

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("pythonPathProgress")));
  expect(saved.drafts.playground).toBe('print("Fallback works")');

  await page.locator(".run-code").click();
  await expect(page.locator("#codeOutput")).toContainText("Browser test output");
});
