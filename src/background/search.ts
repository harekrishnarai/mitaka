import { showNotification } from "~/background/notification";
import type { CommandRunner } from "~/command/runner";

export async function searchAll(runner: CommandRunner): Promise<void> {
  const results = runner.searchAll();
  for (const result of results) {
    if (result.isOk()) {
      await chrome.tabs.create({ url: result.value });
    } else {
      showNotification(result.error);
    }
  }
}

export async function search(runner: CommandRunner): Promise<void> {
  const result = runner.search();
  if (result.isOk()) {
    await chrome.tabs.create({ url: result.value });
  } else {
    showNotification(result.error);
  }
}
