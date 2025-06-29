declare global {
  interface Window {
    MSStream?: object;
  }
}

export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
