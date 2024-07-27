import { debounce } from "@github/mini-throttle";

import { sendToBackground } from "@plasmohq/messaging";

import { getOptions } from "~/storage";

export {};

export async function onSelectionChange(): Promise<void> {
  const options = await getOptions();

  const selection = window.getSelection();
  const selectionText = selection ? selection.toString().trim() : null;
  let link: string | null = null;

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0).startContainer.parentElement;
    if (range && range.hasAttribute("href")) {
      link = range.getAttribute("href");
    }
  }

  const text = ((): string => {
    if (options.href && link) {
      return link;
    }
    return selectionText || "";
  })();

  if (text !== "") {
    if (options.debug) {
      // eslint-disable-next-line no-console
      console.debug(`Mitaka: "${text}" selected`);
    }

    await sendToBackground({
      name: "create-context-menus",
      body: { text, options },
    });
  }
}

if (typeof document !== "undefined") {
  document.addEventListener(
    "selectionchange",
    debounce(async () => {
      await onSelectionChange();
    }, 250),
  );
}
