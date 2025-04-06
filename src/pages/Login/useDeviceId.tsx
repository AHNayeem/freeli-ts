/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import MD5 from "md5";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

// Utility functions for cookies
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

const useDeviceId = (): string | null => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // Function to detect incognito mode (works for Chromium-based browsers)
  function isIncognitoMode(): Promise<boolean> {
    return new Promise((resolve) => {
      const on = () => resolve(true);
      const off = () => resolve(false);

      const fs = (window as any).RequestFileSystem || (window as any).webkitRequestFileSystem;
      if (!fs) {
        off(); // Non-Chromium browsers (Firefox, etc.)
      } else {
        // Detect incognito mode in Chromium browsers
        // (fs as any)(window.TEMPORARY, 100, off, on); 
        // Casting `window.TEMPORARY` to `any` to prevent TypeScript error
        (fs as any)((window as any).TEMPORARY, 100, off, on); 
      }
    });
  }

  // Generate or retrieve persistent device ID from localStorage
  function getPersistentDeviceId(): string {
    let deviceId = getCookie('device_id');
    if (!deviceId) {
      deviceId = uuidv4();  // Generates a unique UUID
      setCookie('device_id', deviceId, 365);  // Store in localStorage for user profile persistence
    }
    return deviceId;
  }

  // Generate or retrieve persistent device ID from sessionStorage (for incognito)
  function getSessionIncognitoId(): string {
    let sessionId = getCookie('incognito_device_id');
    if (!sessionId) {
      sessionId = uuidv4();  // Generate a new UUID for this incognito session
      setCookie('incognito_device_id', sessionId, 365);
    }
    return sessionId;
  }

  useEffect(() => {
    // Initialize FingerprintJS
    const getFingerprint = async () => {
      const incognito = await isIncognitoMode();
      let did: string;

      if (incognito) {
        // Use sessionStorage for incognito mode (same ID for the session, cleared after)
        did = getSessionIncognitoId();
      } else {
        // Use persistent localStorage for normal tabs and user profiles
        did = getPersistentDeviceId();
      }

      // Optionally, combine with FingerprintJS as a fallback or uniqueness factor
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      // Combine fingerprint with deviceId for extra uniqueness (if needed)
      did += "_" + result.visitorId;
      did = MD5(did);
      localStorage.setItem("xmpp_tokenid", did);
      setDeviceId(did);
    };

    getFingerprint();
  }, []);

  return deviceId;
};

export default useDeviceId;
