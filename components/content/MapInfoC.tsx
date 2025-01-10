"use client";
import { useLocale } from "next-intl";

const MapInfoC = ({settings}) => {
    const locale = useLocale();
    
    return (
        <div className="mapInfoC">
            <div className="mapouter">
                <div className="gmap_canvas">
                    <iframe 
                        className="gmap_iframe" 
                        src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=المكتب رقم 8، الطابق 804، المبنى رقم 304  الخوض، السيب، مسقط  صندوق بريد 105، الرمز البريدي 123  سلطنة عمان&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                        style={{
                            width: "100%",
                            height: "400px",
                            border: 0
                        }}
                    />
                </div>
            </div>
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
                    <span 
                        className="text-sm" 
                        dangerouslySetInnerHTML={{ 
                            __html: locale === "ar" ? settings?.address_ar : settings?.address_en
                        }} 
                    />
                </div>
            </div>
        </div>
    );
};

export default MapInfoC;