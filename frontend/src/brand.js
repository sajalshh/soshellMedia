import headerLogo from "./assets/img/logo/header.png";
import footerLogo from "./assets/img/logo/logo.png";

// One build serves both soshellmedia.co and letaihandle.com; only the logo differs.
// The letaihandle logo lives in public/ so it can be swapped without a code change.
const isLetAiHandle = window.location.hostname.includes("letaihandle");

export const HEADER_LOGO = isLetAiHandle ? "/letaihandle-logo.png" : headerLogo;
export const FOOTER_LOGO = isLetAiHandle ? "/letaihandle-logo.png" : footerLogo;
