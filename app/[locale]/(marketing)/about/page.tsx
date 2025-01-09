// app/[locale]/about/page.tsx
import { db } from "@/lib/db";
import Image from "next/image";

interface Props {
  params: {
    locale: string;
  };
}

export default async function AboutPage({ params: { locale } }: Props) {

  const page = await db.page.findUnique({
    where: {
      slug: 'about'
    },
    include: {
      sections: {
        where: {
          type: 'ABOUT',
          isVisible: true
        },
        include: {
          inputs: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      }
    }
  });

  const aboutSection = page?.sections[0];
  const content = {
    title: {
      ar: aboutSection?.inputs.find(i => i.label === 'title_ar')?.value || '',
      en: aboutSection?.inputs.find(i => i.label === 'title_en')?.value || ''
    },
    content: {
      ar: aboutSection?.inputs.find(i => i.label === 'content_ar')?.value || '',
      en: aboutSection?.inputs.find(i => i.label === 'content_en')?.value || ''
    },
    vision: {
      title: {
        ar: aboutSection?.inputs.find(i => i.label === 'vision_title_ar')?.value || '',
        en: aboutSection?.inputs.find(i => i.label === 'vision_title_en')?.value || ''
      },
      content: {
        ar: aboutSection?.inputs.find(i => i.label === 'vision_content_ar')?.value || '',
        en: aboutSection?.inputs.find(i => i.label === 'vision_content_en')?.value || ''
      }
    },
    mission: {
      title: {
        ar: aboutSection?.inputs.find(i => i.label === 'mission_title_ar')?.value || '',
        en: aboutSection?.inputs.find(i => i.label === 'mission_title_en')?.value || ''
      },
      content: {
        ar: aboutSection?.inputs.find(i => i.label === 'mission_content_ar')?.value || '',
        en: aboutSection?.inputs.find(i => i.label === 'mission_content_en')?.value || ''
      }
    }
  };

  return (
    <>
      <header className="headerPage">
        <div className="bgHeader"></div>
        <div className="bgImgHeaderPage">
          <Image 
            src="/images/BG_Page.png" 
            alt="" 
            width={1920} 
            height={1080}
            className="w-full h-full object-cover"
          />
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
                <span className="uppercase font-bold text-white">
                  {locale === 'ar' ? 'قصتنا.' : 'OUR STORY.'}
                </span>
              </div>
            </div>

            <p 
              className="max-w-4xl text-2xl md:text-3xl lg:text-4xl uppercase"
              dangerouslySetInnerHTML={{ 
                __html: locale === 'ar' ? content.title.ar : content.title.en 
              }}
            />
    
            <div className="arrowBtn">
              <a href="/contact" className="action btnArrow flex items-center gap-1 w-max mt-5 py-1 px-8">
                <span className="textbtn">
                  {locale === 'ar' ? 'احجز استشارة مجانية الآن' : 'Book a FREE Consultation Now'}
                </span>
              </a>
              <Image 
                src="/images/arrowHero.svg" 
                alt="" 
                width={100} 
                height={50}
              />
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
                {locale === 'ar' ? 'قصتنا.' : 'OUR STORY.'}
              </span>
            </div>
          </div>

          <div className="max-w-4xl m-auto mt-10 textB text-center">
            <div>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: locale === 'ar' ? content.content.ar : content.content.en 
                }}
              />
            </div>
          </div>

          <div className="max-w-4xl m-auto mt-10">
            <div className="cards cardShow mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              <div className="cardS">
                <div className="textCardS">
                  <p className="text-base lg:text-xl">
                    {locale === 'ar' ? content.vision.title.ar : content.vision.title.en}
                  </p>
                  <ul>
                    <li dangerouslySetInnerHTML={{ 
                      __html: locale === 'ar' ? content.vision.content.ar : content.vision.content.en 
                    }} />
                  </ul>
                </div>
              </div>
              
              <div className="cardS orgCS">
                <Image 
                  src="/images/02.jpg" 
                  alt=""
                  width={500}
                  height={300}
                  className="w-full h-auto"
                />
                <div className="textCardS">
                  <p className="text-base lg:text-xl">
                    {locale === 'ar' ? content.mission.title.ar : content.mission.title.en}
                  </p>
                  <ul>
                    <li dangerouslySetInnerHTML={{ 
                      __html: locale === 'ar' ? content.mission.content.ar : content.mission.content.en 
                    }} />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}