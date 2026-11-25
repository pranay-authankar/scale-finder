import { useCallback, useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

function detectIosSafari() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIos && isSafari;
}

function detectStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
    window.navigator.standalone === true
  );
}

/**
 * Handles PWA installation prompts (Android/Desktop + iOS guidance)
 * and automatic background Service Worker updates whenever new builds are deployed.
 */
export function usePwa() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(detectStandalone);
  const [isIosSafari] = useState(detectIosSafari);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [updatingBanner, setUpdatingBanner] = useState(false);

  const registrationRef = useRef(null);
  const reloadedRef = useRef(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;

    const onControllerChange = () => {
      if (reloadedRef.current) return;
      reloadedRef.current = true;
      setUpdatingBanner(true);
      window.setTimeout(() => {
        window.location.reload();
      }, 350);
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    const updateSW = registerSW({
      immediate: true,
      onRegisteredSW(_swUrl, registration) {
        if (!registration) return;
        registrationRef.current = registration;

        // Check immediately and periodically for newly deployed app updates
        registration.update().catch(() => {});
      },
      onNeedRefresh() {
        setUpdatingBanner(true);
        updateSW(true);
      }
    });

    const checkForUpdates = () => {
      if (document.visibilityState === 'visible' && registrationRef.current) {
        registrationRef.current.update().catch(() => {});
      }
    };

    const intervalId = window.setInterval(() => {
      if (registrationRef.current) {
        registrationRef.current.update().catch(() => {});
      }
    }, 60 * 1000);

    document.addEventListener('visibilitychange', checkForUpdates);
    window.addEventListener('focus', checkForUpdates);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      document.removeEventListener('visibilitychange', checkForUpdates);
      window.removeEventListener('focus', checkForUpdates);
      window.clearInterval(intervalId);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      return;
    }
    if (isIosSafari && !isInstalled) {
      setShowIosGuide((prev) => !prev);
    }
  }, [deferredPrompt, isInstalled, isIosSafari]);

  const checkUpdateNow = useCallback(() => {
    if (registrationRef.current) {
      registrationRef.current.update().catch(() => {});
    }
  }, []);

  return {
    canInstall: Boolean(deferredPrompt) || (isIosSafari && !isInstalled),
    hasNativePrompt: Boolean(deferredPrompt),
    isInstalled,
    isIosSafari,
    showIosGuide,
    setShowIosGuide,
    updatingBanner,
    promptInstall,
    checkUpdateNow
  };
}

