// app/[locale]/services/page.tsx
import { db } from "@/lib/db";
import Image from "next/image";

interface Props {
  params: {
    locale: string;
  };
}

export default async function ServicePage({ params: { locale } }: Props) {
  // Fetch services section data from home page
  const page = await db.page.findUnique({
    where: {
      slug: 'home'
    },
    include: {
      sections: {
        include: {
          inputs: {
            orderBy: {
              order: 'asc'
            }
          }
        },
        where: {
          type: 'SERVICES',
          isVisible: true
        }
      }
    }
  });

  // Fetch active services
  const services = await db.service.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Get services section data
  const servicesSection = page?.sections[0];
  const sectionData = {
    title: {
      ar: servicesSection?.inputs.find(i => i.label === 'title_ar')?.value || '',
      en: servicesSection?.inputs.find(i => i.label === 'title_en')?.value || ''
    }
  };

  return (
    <>
      <header className="headerPage">
        <div className="bgHeader"></div>
        <div className="bgImgHeaderPage">
          <Image src="/images/BG_Page.webp" alt="" width={1920} height={1080} />
        </div>

        <div className="container headerTextPage relative z-20 flex items-center gap-5 text-white h-full">
          <div className="textHomeHero text-start">
            <div className="ballsCT">
              <div className="ballsColor">
                <div className="ballC"></div>
                <div className="ballC"></div>
                <div className="ballC"></div>
              </div>
              <div>
                <span className="uppercase font-bold">
                  {locale === 'ar' ? "خدماتنا." : "OUR SERVICES."}
                </span>
              </div>
            </div>

            <p 
              className="max-w-4xl text-2xl md:text-3xl lg:text-4xl uppercase"
              dangerouslySetInnerHTML={{ 
                __html: locale === 'ar' ? sectionData.title.ar : sectionData.title.en 
              }}
            />

            <div className="arrowBtn">
              <a href="/contact" className="action btnArrow flex items-center gap-1 w-max mt-5 py-1 px-8">
                <span className="textbtn">
                  {locale === 'ar' ? "احجز استشارة مجانية الآن" : "Book a FREE Consultation Now"}
                </span>
              </a>
              <Image src="/images/arrowHero.svg" alt="" width={100} height={100} />
            </div>
          </div>
        </div>
      </header>

      <section className="sectionPage container m-auto">
        <div className="m-auto gap-5">
          <div className="ballsCT">
            <div className="ballsColor">
              <div className="ballC"></div>
              <div className="ballC"></div>
              <div className="ballC"></div>
            </div>
            <div>
              <span className="uppercase textB font-bold">
                {locale === 'ar' ? "كيف يمكننا المساعدة." : "How We Can Help."}
              </span>
            </div>
          </div>

          <div className="m-auto mt-10">
            <div className="cards cardShow mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <div key={service.id} className={`cardS ${index % 2 !== 0 ? 'orgCS' : ''}`}>
                  {service.image && (
                    <Image 
                      src={service.image} 
                      alt={locale === 'ar' ? service.title_ar : service.title_en}
                      width={500}
                      height={300}
                    />
                  )}
                  <div className="textCardS">
                    <p className="text-base lg:text-xl"
                    dangerouslySetInnerHTML={{ 
                        __html: locale === 'ar' ? service.title_ar : service.title_en
                      }} 
                    />  
                    <ul>
                      <li 
                        dangerouslySetInnerHTML={{ 
                          __html: locale === 'ar' ? service.subtitle_ar : service.subtitle_en 
                        }} 
                      />
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}