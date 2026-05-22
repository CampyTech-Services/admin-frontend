import { useEffect, useMemo, useState } from "react";
import {
  matchesAllowedIp,
  parseAllowedIpList,
} from "../utils/adminHelpers";

const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
const fallbackIpLookupUrl = "https://api.ipify.org?format=json";

export function useAdminAccess() {
  const allowedIpPatterns = useMemo(
    () => parseAllowedIpList(process.env.NEXT_PUBLIC_ADMIN_ALLOWED_IPS),
    [],
  );
  const whitelistEnabled = allowedIpPatterns.length > 0;
  const [state, setState] = useState({
    checkingAccess: whitelistEnabled,
    hasAccess: !whitelistEnabled,
    detectedIp: "",
  });

  useEffect(() => {
    let isMounted = true;

    if (!whitelistEnabled) {
      setState({
        checkingAccess: false,
        hasAccess: true,
        detectedIp: "",
      });
      return () => {
        isMounted = false;
      };
    }

    const currentHost = window.location.hostname;

    if (localHosts.has(currentHost)) {
      setState({
        checkingAccess: false,
        hasAccess: true,
        detectedIp: currentHost,
      });
      return () => {
        isMounted = false;
      };
    }

    async function validateIpAccess() {
      try {
        const response = await window.fetch(
          process.env.NEXT_PUBLIC_ADMIN_IP_LOOKUP_URL || fallbackIpLookupUrl,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Unable to verify your network origin.");
        }

        const data = await response.json();
        const detectedIp =
          typeof data?.ip === "string" ? data.ip.trim() : "";
        const hasAccess = matchesAllowedIp(detectedIp, allowedIpPatterns);

        if (!isMounted) {
          return;
        }

        setState({
          checkingAccess: false,
          hasAccess,
          detectedIp,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setState({
          checkingAccess: false,
          hasAccess: false,
          detectedIp: "",
        });
      }
    }

    validateIpAccess();

    return () => {
      isMounted = false;
    };
  }, [allowedIpPatterns, whitelistEnabled]);

  return {
    ...state,
    whitelistEnabled,
  };
}
