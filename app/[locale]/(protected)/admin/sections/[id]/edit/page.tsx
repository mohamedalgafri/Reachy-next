// app/admin/sections/[id]/edit/page.tsx
import HeroSectionForm from "@/components/forms/HeroForm";
import StoryForm from "@/components/forms/StoryForm";
import ServicesSectionForm from "@/components/forms/ServicesSectionForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import FeaturesSectionForm from "@/components/forms/FeaturesForm";

export const metadata: Metadata = {
  title: "تعديل القسم",
  description: "تعديل محتوى القسم",
};

interface EditSectionPageProps {
  params: {
    id: string;
  };
}

export default async function EditSectionPage({ params }: EditSectionPageProps) {
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
          buttonText_ar: section.inputs.find(i => i.label === 'buttonText_ar')?.value || '',
          buttonText_en: section.inputs.find(i => i.label === 'buttonText_en')?.value || '',
          buttonLink: section.inputs.find(i => i.label === 'buttonLink')?.value || ''
        };

      case 'STORY':
        return {
          title: section.inputs.find(i => i.label === 'title')?.value || '',
          subTitle: section.inputs.find(i => i.label === 'subTitle')?.value || '',
          profileUrl: section.inputs.find(i => i.label === 'profileUrl')?.value || ''
        };

      case 'FEATURES':
        // تجميع العناوين
        const title = {
          ar: section.inputs.find(i => i.label === 'title_ar')?.value || '',
          en: section.inputs.find(i => i.label === 'title_en')?.value || ''
        };

        // تجميع المميزات
        const featuresMap = new Map();

        section.inputs.forEach(input => {
          // تعديل التعبير المنتظم ليتطابق مع تخزين البيانات
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

          // معالجة كل نوع من البيانات
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
        // تجميع الخدمات
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
        
      default:
        return <div className="text-center p-4 text-red-500">نوع القسم غير معروف</div>;
    }
  };

  return (
    <div className="p-6">
      {renderForm()}
    </div>
  );
}