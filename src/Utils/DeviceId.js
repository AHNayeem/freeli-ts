import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { MD5 } from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import { setCookie, getCookie } from './Common';
const DeviceId = () => {
  const [deviceId, setDeviceId] = useState(null);

  // Function to detect incognito mode (works for Chromium-based browsers)
  function isIncognitoMode() {
    return new Promise((resolve) => {
      const on = () => resolve(true);
      const off = () => resolve(false);

      const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
      if (!fs) {
        off(); // Non-Chromium browsers (Firefox, etc.)
      } else {
        fs(window.TEMPORARY, 100, off, on); // Detect incognito mode in Chromium browsers
      }
    });
  }

  // Generate or retrieve persistent device ID from localStorage
  function getPersistentDeviceId() {
    let deviceId = getCookie('device_id');
    if (!deviceId) {
      deviceId = uuidv4();  // Generates a unique UUID
      setCookie('device_id', deviceId, 365);  // Store in localStorage for user profile persistence
    }
    return deviceId;
  }

  // Generate or retrieve persistent device ID from sessionStorage (for incognito)
  function getSessionIncognitoId() {
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
      let did;

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

export default DeviceId;