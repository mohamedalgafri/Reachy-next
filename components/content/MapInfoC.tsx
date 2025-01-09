"use client";

import { useLocale } from "next-intl";

const MapInfoC = ({settings}) => {
    const locale = useLocale();
  return (
    <div className="mapInfoC">
    <div className="mapC"></div>
    <div className="infoC mt-3">
      <div>
        <div>
          <span>{locale === "ar" ? "البريد الالكتروني" : "Email"}</span>
        </div>
        <span className="text-sm">{settings?.email}</span>
      </div>
      <div className="borderC">
        <div>
          <span>{locale === "ar" ? "الهاتف":"PHONE"}</span>
        </div>
        <span className="text-sm">{settings?.phone}</span>
      </div>
      <div className="infoItem">
        <div>
          <span>{locale === "ar" ? "العنوان":"ADDRESS"}</span>
        </div>
        <span className="text-sm" dangerouslySetInnerHTML={{ __html : locale === "ar" ? settings?.address_ar : settings?.address_en}} />
      </div>
    </div>
  </div>
  )
}

export default MapInfoC
