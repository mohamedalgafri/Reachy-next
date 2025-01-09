// app/page.tsx
import HeroSection from "@/components/sections/hero-section";
import StorySection from "@/components/sections/story-section";
import ServicesSection from "@/components/sections/services-section";
import FeaturesSection from "@/components/sections/features-section";
import { db } from "@/lib/db";
import ClientsSection from "@/components/sections/clients-section";
import ContactSection from "@/components/sections/contact-section";

interface Section {
  id: number;
  type: 'HERO' | 'STORY' | 'SERVICES' | 'FEATURES';
  inputs: Array<{
    label: string;
    value: string;
    order: number;
  }>;
}

export default async function HomePage() {
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
        orderBy: {
          order: 'asc'
        },
        where: {
          isVisible: true
        }
      }
    }
  });

  // جلب الخدمات النشطة
  const services = await db.service.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const features = await db.feature.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const clients = await db.client.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  if (!page) {
    return null;
  }

  const formatBilingualData = (section: Section) => {
    const data: Record<string, any> = {};
    
    section.inputs.forEach(input => {
      // البحث عن الحقول ثنائية اللغة
      const bilingualMatch = input.label.match(/(.+)_(ar|en)$/);
      
      if (bilingualMatch) {
        // استخراج اسم الحقل واللغة
        const [, fieldName, lang] = bilingualMatch;
        
        // إنشاء كائن اللغة إذا لم يكن موجوداً
        if (!data[fieldName]) {
          data[fieldName] = { ar: '', en: '' };
        }
        
        // تعيين قيمة اللغة المناسبة
        data[fieldName][lang] = input.value;
      } else {
        // الحقول العادية
        data[input.label] = input.value;
      }
    });
    
    return data;
  };

  const formatFeaturesData = (section: Section) => {
    const title = {
      ar: section.inputs.find(i => i.label === 'title_ar')?.value || '',
      en: section.inputs.find(i => i.label === 'title_en')?.value || ''
    };

    const featuresMap = new Map();
    
    section.inputs.forEach(input => {
      const match = input.label.match(/feature_(\d+)_(\w+)_(ar|en|icon)/);
      if (!match) return;

      const [, index, field, lang] = match;
      const featureIndex = parseInt(index);

      const feature = featuresMap.get(featureIndex);
      if (field === 'title') {
        feature.title[lang] = input.value;
      }
    });

    return {
      title
    };
  };

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'SERVICES':
        const servicesData = {
          title: {
            ar: section.inputs.find(i => i.label === 'title_ar')?.value || '',
            en: section.inputs.find(i => i.label === 'title_en')?.value || ''
          }
        };
        return (
          <ServicesSection 
            key={section.id} 
            data={servicesData} 
            services={services} 
          />
        );

      case 'FEATURES':
        return (
          <FeaturesSection
            key={section.id}
            features={features}
            data={formatFeaturesData(section)}
          />
        );

      case 'HERO':
        return (
          <HeroSection 
            key={section.id} 
            data={formatBilingualData(section)} 
          />
        );

      case 'STORY':
        return (
          <StorySection 
            key={section.id} 
            data={formatBilingualData(section)} 
          />
        );

      default:
        return null;
    }
  };

  return (
    <main>
      {page.sections.map((section) => renderSection(section))}
      <ClientsSection  clients={clients} />
      <ContactSection />
    </main>
  );
}