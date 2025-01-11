// app/admin/sections/[id]/edit/page.tsx
import HeroSectionForm from "@/components/forms/HeroForm";
import StoryForm from "@/components/forms/StoryForm";
import ServicesSectionForm from "@/components/forms/ServicesSectionForm";
import FeaturesSectionForm from "@/components/forms/FeaturesForm";
import AboutForm from "@/components/forms/AboutForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === 'ar' ? "تعديل القسم" : "Edit Section",
    description: locale === 'ar' ? "تعديل محتوى القسم" : "Edit section content",
  };
}

interface EditSectionPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default async function EditSectionPage({ params }: EditSectionPageProps) {
  const locale = await getLocale();
  if (!params?.id) return notFound();

  const sectionId = parseInt(params.id);
  if (isNaN(sectionId)) return notFound();

  const section = await db.section.findUnique({
    where: { id: sectionId },
    include: {
      inputs: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!section) return notFound();

  const getFormattedData = () => {
    switch (section.type) {
      case 'HERO':
        return {
          title_ar: section.inputs.find(i => i.label === 'title_ar')?.value || '',
          title_en: section.inputs.find(i => i.label === 'title_en')?.value || '',
          subTitle_ar: section.inputs.find(i => i.label === 'subTitle_ar')?.value || '',
          subTitle_en: section.inputs.find(i => i.label === 'subTitle_en')?.value || '',
        };

      case 'ABOUT':
        return {
          title_ar: section.inputs.find(i => i.label === 'title_ar')?.value || '',
          title_en: section.inputs.find(i => i.label === 'title_en')?.value || '',
          content_ar: section.inputs.find(i => i.label === 'content_ar')?.value || '',
          content_en: section.inputs.find(i => i.label === 'content_en')?.value || '',
          vision_title_ar: section.inputs.find(i => i.label === 'vision_title_ar')?.value || '',
          vision_title_en: section.inputs.find(i => i.label === 'vision_title_en')?.value || '',
          vision_content_ar: section.inputs.find(i => i.label === 'vision_content_ar')?.value || '',
          vision_content_en: section.inputs.find(i => i.label === 'vision_content_en')?.value || '',
          mission_title_ar: section.inputs.find(i => i.label === 'mission_title_ar')?.value || '',
          mission_title_en: section.inputs.find(i => i.label === 'mission_title_en')?.value || '',
          mission_content_ar: section.inputs.find(i => i.label === 'mission_content_ar')?.value || '',
          mission_content_en: section.inputs.find(i => i.label === 'mission_content_en')?.value || ''
        };
    
      case 'STORY':
        return {
          title_ar: section.inputs.find(i => i.label === 'title_ar')?.value || '',
          title_en: section.inputs.find(i => i.label === 'title_en')?.value || '',
          subTitle_ar: section.inputs.find(i => i.label === 'subTitle_ar')?.value || '',
          subTitle_en: section.inputs.find(i => i.label === 'subTitle_en')?.value || '',
          profileUrl: section.inputs.find(i => i.label === 'profileUrl')?.value || ''
        };

      case 'FEATURES':
        const title = {
          ar: section.inputs.find(i => i.label === 'title_ar')?.value || '',
          en: section.inputs.find(i => i.label === 'title_en')?.value || ''
        };

        const featuresMap = new Map();

        section.inputs.forEach(input => {
          const match = input.label.match(/feature_(\d+)_(\w+)/);
          if (!match) return;

          const [, index, field] = match;
          const featureIndex = parseInt(index);

          if (!featuresMap.has(featureIndex)) {
            featuresMap.set(featureIndex, {
              title: { ar: '', en: '' },
              icon: ''
            });
          }

          const feature = featuresMap.get(featureIndex);

          if (field === 'title_ar') {
            feature.title.ar = input.value;
          } else if (field === 'title_en') {
            feature.title.en = input.value;
          } else if (field === 'icon') {
            feature.icon = input.value;
          }
        });

        return {
          title
        };

      case 'SERVICES':
        const servicesMap = new Map();

        section.inputs.forEach(input => {
          const match = input.label.match(/service_(\d+)_(\w+)/);
          if (!match) return;

          const [, index, field] = match;
          const serviceIndex = parseInt(index);

          if (!servicesMap.has(serviceIndex)) {
            servicesMap.set(serviceIndex, {
              title: '',
              description: ''
            });
          }

          const service = servicesMap.get(serviceIndex);
          service[field] = input.value;
        });

        return {
          title: section.inputs.find(i => i.label === 'title')?.value || '',
          services: Array.from(servicesMap.values())
            .filter(service => service.title && service.description)
        };

      default:
        return null;
    }
  };

  const formattedData = getFormattedData();
  if (!formattedData) return notFound();

  const renderForm = () => {
    const props = {
      initialData: formattedData,
      sectionId
    };

    switch (section.type) {
      case 'HERO':
        return <HeroSectionForm {...props} />;
      case 'STORY':
        return <StoryForm {...props} />;
      case 'FEATURES':
        return <FeaturesSectionForm {...props} />;
      case 'SERVICES':
        return <ServicesSectionForm {...props} />;
      case 'ABOUT':
        return <AboutForm {...props} />;
      default:
        return (
          <div className="text-center p-4 text-red-500">
            {locale === 'ar' ? "نوع القسم غير معروف" : "Unknown section type"}
          </div>
        );
    }
  };

  return (
    <div className="p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {renderForm()}
    </div>
  );
}