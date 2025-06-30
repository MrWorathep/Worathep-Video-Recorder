import Bowser from "bowser";

export function isIOS() {
  const browser = Bowser.getParser(window.navigator.userAgent);
  const osName = browser.getOSName(true);
  const platformType = browser.getPlatformType(true);

  return (
    osName === "ios" && (platformType === "mobile" || platformType === "tablet")
  );
}
