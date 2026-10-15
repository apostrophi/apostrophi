import { describe, expect, it } from "vitest";
import { resolveShortcuts } from "../../shared/shortcuts";
import { menuAccelerator } from "./menu-accelerator";

describe("native menu shortcut presentation", () => {
  it("uses effective overrides for native-owned commands", () => {
    const bindings = resolveShortcuts({
      profile: "apostrophi",
      overrides: {
        "view.layout-cycle": "Control+Shift+J",
        "view.inspector": "Alt+I",
        "view.zoom-in": "Mod+ArrowUp",
        "nav.back": "Alt+ArrowLeft",
        "app.summon": "Control+Alt+F12",
      },
    });
    expect(menuAccelerator(bindings["view.layout-cycle"])).toBe(
      "Control+Shift+J",
    );
    expect(menuAccelerator(bindings["view.inspector"])).toBe("Alt+I");
    expect(menuAccelerator(bindings["view.zoom-in"])).toBe(
      "CommandOrControl+Up",
    );
    expect(menuAccelerator(bindings["nav.back"])).toBe("Alt+Left");
    expect(menuAccelerator(bindings["app.summon"])).toBe("Control+Alt+F12");
  });
  it("tracks Eagle profile changes and restores defaults after resetting overrides", () => {
    const eagle = resolveShortcuts({ profile: "eagle", overrides: {} });
    expect(menuAccelerator(eagle["save.add-tag"])).toBe("T");
    expect(menuAccelerator(eagle["save.reveal"])).toBe("CommandOrControl+R");
    expect(menuAccelerator(eagle["view.layout-grid"])).toBe("Alt+2");
    const apostrophi = resolveShortcuts({
      profile: "apostrophi",
      overrides: {},
    });
    expect(menuAccelerator(apostrophi["view.layout-cycle"])).toBe(
      "CommandOrControl+Shift+L",
    );
    expect(menuAccelerator(apostrophi["view.grayscale"])).toBe(
      "CommandOrControl+Alt+G",
    );
    expect(menuAccelerator(apostrophi["nav.library"])).toBe("G L");
    expect(menuAccelerator(apostrophi["save.reveal"])).toBe("F");
  });
});
