const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {

      // حذف المستخدم القديم إذا وجد
      await prisma.user.deleteMany();

      // إنشاء كلمة مرور مشفرة
      const hashedPassword = await bcrypt.hash("123456", 10);
  
      // إنشاء مستخدم المدير
      const adminUser = await prisma.user.create({
        data: {
          name: "Admin",
          email: "admin@example.com",
          password: hashedPassword,
          role: "ADMIN",
        }
      });
  
      console.log('Created admin user:', adminUser);


  await prisma.input.deleteMany();
  await prisma.section.deleteMany();
  await prisma.page.deleteMany();

  const homePage = await prisma.page.create({
    data: {
      title: 'الرئيسية',
      slug: 'home',
      sections: {
        create: [
          {
            title: 'Hero Section',
            type: 'HERO',
            order: 1,
            isVisible: true,
            inputs: {
              create: [
                {
                  label: 'title',
                  type: 'RICH_TEXT',
                  value: '<h1>Innovating Tomorrows Marketing,Today</h1>',
                  order: 1
                },
                {
                  label: 'subTitle',
                  type: 'RICH_TEXT',
                  value: '<p>WANNA REACH EASY?</p>',
                  order: 2
                },
                {
                  label: 'buttonText',
                  type: 'TEXT',
                  value: 'Book a FREE Consultation Now',
                  order: 3
                },
                {
                  label: 'buttonLink',
                  type: 'TEXT',
                  value: '/about-us',
                  order: 4
                }
              ]
            }
          },
          {
            title: 'Our Story',
            type: 'STORY',
            order: 2,
            isVisible: true,
            inputs: {
              create: [
                {
                  label: 'title',
                  type: 'RICH_TEXT',
                  value: '<h2>Imagination <br/> breeds innovation</h2>',
                  order: 1
                },
                {
                  label: 'subTitle',
                  type: 'RICH_TEXT',
                  value: '<p>REACHY Digital Marketing is a creative firm that specializes in cutting-edge digital solutions. By using tailored approaches that prioritize accessibility and creativity, we hope to empower brands to interact efficiently with their target audienceMore About usDownload Profile</p>',
                  order: 2
                },
                {
                  label: 'profileUrl',
                  type: 'FILE',
                  value: '', 
                  order: 3
                }
              ]
            }
          },
          {
            title: 'Our Services',
            type: 'SERVICES',
            order: 3,
            isVisible: true,
            inputs: {
              create: [
                {
                  label: 'title',
                  type: 'RICH_TEXT',
                  value: '<h2>Transform Strategies into Success with Our Digital Marketing Expertise!</h2>',
                  order: 1
                }
              ]
            }
          },
          {
            title: 'Our Features',
            type: 'FEATURES',
            order: 4,
            isVisible: true,
            inputs: {
              create: [
                {
                  label: 'mainTitle',
                  type: 'RICH_TEXT',
                  value: '<h2>We build the bridge between your brand and customer</h2>',
                  order: 1
                },
                {
                  label: 'mainSubTitle',
                  type: 'RICH_TEXT',
                  value: '',
                  order: 2
                },
                // Feature 1
                {
                  label: 'feature_0_title',
                  type: 'RICH_TEXT',
                  value: 'Specialized Team',
                  order: 3
                },
                {
                  label: 'feature_0_description',
                  type: 'RICH_TEXT',
                  value: 'Our team includes experts in all areas of digital marketing',
                  order: 4
                },
                {
                  label: 'feature_0_icon',
                  type: 'IMAGE',
                  value: '',
                  order: 5
                },
                // Feature 2
                {
                  label: 'feature_1_title',
                  type: 'RICH_TEXT',
                  value: 'Customized Solutions',
                  order: 6
                },
                {
                  label: 'feature_1_description',
                  type: 'RICH_TEXT',
                  value: 'We design strategies to fit your unique needs',
                  order: 7
                },
                {
                  label: 'feature_1_icon',
                  type: 'IMAGE',
                  value: '',
                  order: 8
                },
                // Feature 3
                {
                  label: 'feature_2_title',
                  type: 'RICH_TEXT',
                  value: 'Tangible Results',
                  order: 9
                },
                {
                  label: 'feature_2_description',
                  type: 'RICH_TEXT',
                  value: 'We focus on achieving your goals as efficiently as possible',
                  order: 10
                },
                {
                  label: 'feature_2_icon',
                  type: 'IMAGE',
                  value: '',
                  order: 11
                },
                // Feature 4
                {
                  label: 'feature_3_title',
                  type: 'RICH_TEXT',
                  value: 'Ongoing Support',
                  order: 12
                },
                {
                  label: 'feature_3_description',
                  type: 'RICH_TEXT',
                  value: 'Provide continuing support to ensure success of your projects',
                  order: 13
                },
                {
                  label: 'feature_3_icon',
                  type: 'IMAGE',
                  value: '',
                  order: 14
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Seeded:', { homePage });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());