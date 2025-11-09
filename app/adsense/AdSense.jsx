"use client";

import { useEffect } from "react";

export default function AdSense({ adClient = "ca-pub-4844671075935249", adSlot = "6468467356", adFormat = "auto", fullWidthResponsive = true, style = { display: "block" } }) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return <ins className="adsbygoogle" style={style} data-ad-client={adClient} data-ad-slot={adSlot} data-ad-format={adFormat} data-full-width-responsive={fullWidthResponsive} />;
}
