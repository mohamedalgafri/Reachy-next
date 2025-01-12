"use client"
import { useLocale } from 'next-intl'
import React from 'react'
import { FaWhatsapp } from 'react-icons/fa6'

const LetsTake = () => {
    const locale = useLocale();
  return (
    <div className="letsTake">
    <a href="" className="letsTakeC rtl:flex-row-reverse">
      <span>{locale === "ar" ? "دعونا نتحدث!" : "Lets Talk!"}</span>
      <FaWhatsapp />
    </a>
  </div>
  )
}

export default LetsTake
