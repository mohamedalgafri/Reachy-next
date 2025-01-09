import { getSiteSettings } from "@/lib/settings";
import ContactForm from "../forms/ContactForm";


export default async function ContactSection() {
    const settings = await getSiteSettings();

    return(
        <>
            <ContactForm settings={settings} />
        </>
    )
}