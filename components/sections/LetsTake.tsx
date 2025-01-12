"use client"
import { useLocale } from 'next-intl'
import React from 'react'
import { FaWhatsapp } from 'react-icons/fa6'

const LetsTake = ({ settings }) => {
    const locale = useLocale();
    return (
        <div className="letsTake">
            {settings?.phone && (
                <a
                    href={`https://wa.me/${settings?.phone}`}
                    target='_blank'
                    className="letsTakeC rtl:flex-row-reverse">
                    <span>{locale === "ar" ? "دعونا نتحدث!" : "Lets Talk!"}</span>
                    <FaWhatsapp />
                </a>
            )}
        </div>

    )
}

export default LetsTake;
