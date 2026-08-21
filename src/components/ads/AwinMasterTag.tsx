"use client";

import { useEffect } from "react";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { AWIN_MASTER_TAG_SRC } from "@/lib/affiliates";

const SCRIPT_ID = "awin-mastertag";

/**
 * Awin Publisher MasterTag — exact snippet from Awin Toolbox:
 * <script src="https://www.dwin2.com/pub.3048693.min.js"></script>
 * Loads only after optional cookie consent (Accept all).
 */
export function AwinMasterTag() {
  const { ready, marketingAllowed } = useCookieConsent();

  useEffect(() => {
    if (!ready || !marketingAllowed) {
      document.getElementById(SCRIPT_ID)?.remove();
      return;
    }

    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = AWIN_MASTER_TAG_SRC;
    script.type = "text/javascript";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById(SCRIPT_ID)?.remove();
    };
  }, [ready, marketingAllowed]);

  return null;
}
