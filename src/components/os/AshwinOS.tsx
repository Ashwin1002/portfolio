"use client";

import { Boot } from "./Boot";
import { Companion } from "./Companion";
import { Desktop, Dock } from "./Desktop";
import { OSProvider } from "./OSProvider";
import { Palette } from "./Palette";
import { SystemBar } from "./SystemBar";
import { WindowLayer } from "./WindowLayer";

export function AshwinOS() {
  return (
    <OSProvider>
      <a className="skip-link" href="#desktop">Skip to desktop</a>
      <Boot />
      <SystemBar />
      <Desktop />
      <WindowLayer />
      <Dock />
      <Companion />
      <Palette />
    </OSProvider>
  );
}
