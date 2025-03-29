
import React from 'react';
import Header from '@/components/Header';
import { useEditor } from '@/hooks/use-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Check, ExternalLink, Globe, Server } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Head from '@/components/Head';

const DeploymentGuide = () => {
  const editor = useEditor();
  
  return (
    <div className="min-h-screen bg-background">
      <Head 
        title="دليل النشر - منصة كودر التفاعلية"
        description="دليل شامل لنشر تطبيقك على الإنترنت وربطه بدومين حقيقي"
      />
      
      <Header 
        html={editor.html} 
        css={editor.css} 
        js={editor.js}
        script={editor.script}
        isDarkMode={editor.isDarkMode}
        toggleDarkMode={editor.toggleDarkMode}
        onSave={editor.handleSave}
      />
      
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">دليل نشر الموقع</h1>
            <Globe className="h-8 w-8 text-primary" />
          </div>
          
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>مهم</AlertTitle>
            <AlertDescription>
              اتبع هذا الدليل لنشر موقعك على الإنترنت وربطه بدومين مخصص. تأكد من قراءة جميع الخطوات بعناية.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="choose-provider" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="choose-provider">اختيار المزود</TabsTrigger>
              <TabsTrigger value="deploy">النشر</TabsTrigger>
              <TabsTrigger value="domain">الدومين</TabsTrigger>
              <TabsTrigger value="supabase">Supabase</TabsTrigger>
            </TabsList>
            
            <TabsContent value="choose-provider">
              <Card>
                <CardHeader>
                  <CardTitle>اختيار مزود الاستضافة</CardTitle>
                  <CardDescription>
                    اختر مزود استضافة موثوق به لنشر موقعك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    هناك العديد من مزودي الاستضافة المناسبين لنشر تطبيقات الويب. إليك بعض الخيارات الموصى بها:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="hover-lift">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Vercel</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          مثالي لتطبيقات React وNext.js. يوفر نشرًا تلقائيًا من GitHub وخيارات مجانية ممتازة.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-900 dark:text-green-100">مجاني</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">سهل الاستخدام</span>
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded dark:bg-purple-900 dark:text-purple-100">CI/CD</span>
                        </div>
                        <Button variant="outline" className="w-full mt-4" asChild>
                          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                            زيارة Vercel <ExternalLink className="mr-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover-lift">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Netlify</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          منصة متكاملة لنشر تطبيقات الويب الحديثة. يوفر وظائف خادم وإدارة نماذج.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-900 dark:text-green-100">مجاني</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">سهل الاستخدام</span>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded dark:bg-yellow-900 dark:text-yellow-100">وظائف خادم</span>
                        </div>
                        <Button variant="outline" className="w-full mt-4" asChild>
                          <a href="https://netlify.com" target="_blank" rel="noopener noreferrer">
                            زيارة Netlify <ExternalLink className="mr-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover-lift">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Firebase Hosting</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          جزء من منصة Firebase من Google. مثالي إذا كنت تستخدم خدمات Firebase الأخرى.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-900 dark:text-green-100">مجاني</span>
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded dark:bg-orange-900 dark:text-orange-100">منصة متكاملة</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">CDN عالمي</span>
                        </div>
                        <Button variant="outline" className="w-full mt-4" asChild>
                          <a href="https://firebase.google.com/products/hosting" target="_blank" rel="noopener noreferrer">
                            زيارة Firebase <ExternalLink className="mr-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover-lift">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">GitHub Pages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          حل مجاني واستضافة مباشرة من مستودع GitHub الخاص بك. مناسب للمشاريع الصغيرة.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-900 dark:text-green-100">مجاني</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded dark:bg-gray-800 dark:text-gray-100">استضافة ثابتة</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">تكامل GitHub</span>
                        </div>
                        <Button variant="outline" className="w-full mt-4" asChild>
                          <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer">
                            زيارة GitHub Pages <ExternalLink className="mr-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="deploy">
              <Card>
                <CardHeader>
                  <CardTitle>نشر تطبيقك</CardTitle>
                  <CardDescription>
                    خطوات بناء ونشر موقعك على الإنترنت
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 1: بناء نسخة الإنتاج</h3>
                        <p className="text-muted-foreground mb-2">
                          قم ببناء نسخة الإنتاج من مشروعك باستخدام الأمر التالي:
                        </p>
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                          <code>npm run build</code>
                        </pre>
                        <p className="text-sm text-muted-foreground mt-2">
                          سيقوم هذا الأمر بإنشاء مجلد <code>dist</code> يحتوي على ملفات مشروعك المُحسّنة للإنتاج.
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 2: النشر على Vercel</h3>
                        <p className="text-muted-foreground mb-4">
                          إذا اخترت Vercel، اتبع هذه الخطوات:
                        </p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li className="text-muted-foreground">قم بإنشاء حساب على <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vercel</a></li>
                          <li className="text-muted-foreground">ربط مستودع GitHub الخاص بك</li>
                          <li className="text-muted-foreground">اختر المستودع وانقر على "Import"</li>
                          <li className="text-muted-foreground">اضبط إعدادات المشروع (عادةً ما يتم اكتشافها تلقائيًا)</li>
                          <li className="text-muted-foreground">انقر على "Deploy" وانتظر اكتمال النشر</li>
                        </ol>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 3: النشر على Netlify</h3>
                        <p className="text-muted-foreground mb-4">
                          إذا اخترت Netlify، اتبع هذه الخطوات:
                        </p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li className="text-muted-foreground">قم بإنشاء حساب على <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Netlify</a></li>
                          <li className="text-muted-foreground">انقر على "New site from Git"</li>
                          <li className="text-muted-foreground">اختر مزود Git (GitHub, GitLab, Bitbucket)</li>
                          <li className="text-muted-foreground">اختر المستودع</li>
                          <li className="text-muted-foreground">اضبط أمر البناء على <code>npm run build</code></li>
                          <li className="text-muted-foreground">اضبط مجلد النشر على <code>dist</code></li>
                          <li className="text-muted-foreground">انقر على "Deploy site"</li>
                        </ol>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Server className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">اختبار الموقع بعد النشر</h3>
                        <p className="text-muted-foreground mb-2">
                          بعد النشر، ستحصل على عنوان URL للموقع. تأكد من اختبار الميزات التالية:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                          <li className="text-muted-foreground">تسجيل الدخول وإنشاء الحساب</li>
                          <li className="text-muted-foreground">الاتصال بقاعدة البيانات وتخزين البيانات</li>
                          <li className="text-muted-foreground">جميع الروابط والتنقل بين الصفحات</li>
                          <li className="text-muted-foreground">توافق الموقع مع مختلف المتصفحات والأجهزة</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="domain">
              <Card>
                <CardHeader>
                  <CardTitle>ربط دومين مخصص</CardTitle>
                  <CardDescription>
                    كيفية شراء وربط دومين مخصص بموقعك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 1: شراء دومين</h3>
                        <p className="text-muted-foreground mb-4">
                          هناك العديد من مسجلي النطاقات المعتمدين. إليك بعض الخيارات الشائعة:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Button variant="outline" asChild>
                            <a href="https://namecheap.com" target="_blank" rel="noopener noreferrer">
                              Namecheap <ExternalLink className="mr-2 h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="outline" asChild>
                            <a href="https://domains.google" target="_blank" rel="noopener noreferrer">
                              Google Domains <ExternalLink className="mr-2 h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="outline" asChild>
                            <a href="https://godaddy.com" target="_blank" rel="noopener noreferrer">
                              GoDaddy <ExternalLink className="mr-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                          ابحث عن النطاق المناسب لموقعك وقم بشرائه. ننصح باختيار الامتدادات الشائعة مثل .com أو .net أو .org.
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 2: ربط الدومين بمنصة الاستضافة</h3>
                        <p className="text-muted-foreground mb-4">
                          بعد شراء الدومين، يجب ربطه بمنصة الاستضافة:
                        </p>
                        
                        <div className="space-y-4">
                          <div className="border p-4 rounded-md">
                            <h4 className="font-medium mb-2">1. ربط الدومين بـ Vercel</h4>
                            <ol className="list-decimal list-inside space-y-2">
                              <li className="text-muted-foreground">في لوحة تحكم Vercel، انتقل إلى المشروع</li>
                              <li className="text-muted-foreground">انقر على "Settings" ثم "Domains"</li>
                              <li className="text-muted-foreground">أضف الدومين الخاص بك</li>
                              <li className="text-muted-foreground">اتبع التعليمات لضبط سجلات DNS</li>
                            </ol>
                          </div>
                          
                          <div className="border p-4 rounded-md">
                            <h4 className="font-medium mb-2">2. ربط الدومين بـ Netlify</h4>
                            <ol className="list-decimal list-inside space-y-2">
                              <li className="text-muted-foreground">في لوحة تحكم Netlify، انتقل إلى المشروع</li>
                              <li className="text-muted-foreground">انقر على "Domain settings"</li>
                              <li className="text-muted-foreground">اختر "Add custom domain"</li>
                              <li className="text-muted-foreground">أدخل الدومين الخاص بك</li>
                              <li className="text-muted-foreground">اتبع التعليمات لضبط سجلات DNS</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 3: تكوين سجلات DNS</h3>
                        <p className="text-muted-foreground mb-4">
                          ستحتاج إلى تعديل سجلات DNS لربط الدومين بمنصة الاستضافة:
                        </p>
                        
                        <div className="bg-muted p-4 rounded-md overflow-x-auto mb-4">
                          <p className="font-medium mb-2">سجلات DNS النموذجية:</p>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-right pr-4 py-2">النوع</th>
                                <th className="text-right pr-4 py-2">المضيف</th>
                                <th className="text-right pr-4 py-2">القيمة</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="pr-4 py-2">A</td>
                                <td className="pr-4 py-2">@</td>
                                <td className="pr-4 py-2">[عنوان IP للخادم]</td>
                              </tr>
                              <tr className="border-b">
                                <td className="pr-4 py-2">CNAME</td>
                                <td className="pr-4 py-2">www</td>
                                <td className="pr-4 py-2">[اسم النطاق الأساسي]</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>ملاحظة مهمة</AlertTitle>
                          <AlertDescription>
                            قد تستغرق تغييرات DNS ما يصل إلى 48 ساعة لتنتشر عالميًا. كن صبورًا بعد إجراء التغييرات.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 4: تفعيل HTTPS</h3>
                        <p className="text-muted-foreground mb-2">
                          تأكد من تفعيل HTTPS لموقعك لتوفير اتصال آمن للمستخدمين:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                          <li className="text-muted-foreground">معظم منصات الاستضافة الحديثة مثل Vercel وNetlify توفر SSL مجانًا تلقائيًا</li>
                          <li className="text-muted-foreground">تأكد من تفعيل إعادة التوجيه من HTTP إلى HTTPS</li>
                          <li className="text-muted-foreground">اختبر موقعك للتأكد من أنه يعمل بشكل صحيح مع HTTPS</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="supabase">
              <Card>
                <CardHeader>
                  <CardTitle>تهيئة Supabase للإنتاج</CardTitle>
                  <CardDescription>
                    إعداد Supabase للعمل مع موقعك المنشور
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 1: تحديث إعدادات المصادقة</h3>
                        <p className="text-muted-foreground mb-4">
                          يجب تحديث إعدادات المصادقة في Supabase لتعمل مع دومينك الجديد:
                        </p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li className="text-muted-foreground">انتقل إلى لوحة تحكم Supabase</li>
                          <li className="text-muted-foreground">افتح مشروعك واذهب إلى "Authentication" ثم "Settings"</li>
                          <li className="text-muted-foreground">أضف دومينك الجديد في "Site URL"</li>
                          <li className="text-muted-foreground">أضف عناوين URL إعادة التوجيه في "Redirect URLs"</li>
                          <li className="text-muted-foreground">احفظ التغييرات</li>
                        </ol>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 2: تحديث متغيرات البيئة</h3>
                        <p className="text-muted-foreground mb-4">
                          تأكد من تحديث متغيرات البيئة في منصة الاستضافة:
                        </p>
                        <div className="bg-muted p-4 rounded-md overflow-x-auto mb-4">
                          <p className="font-medium mb-2">متغيرات البيئة الضرورية:</p>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-right pr-4 py-2">المتغير</th>
                                <th className="text-right pr-4 py-2">القيمة</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="pr-4 py-2">VITE_SUPABASE_URL</td>
                                <td className="pr-4 py-2">[رابط Supabase الخاص بك]</td>
                              </tr>
                              <tr className="border-b">
                                <td className="pr-4 py-2">VITE_SUPABASE_ANON_KEY</td>
                                <td className="pr-4 py-2">[مفتاح Supabase العام]</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          يمكنك العثور على هذه القيم في لوحة تحكم Supabase من قسم "Settings" ثم "API".
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 3: تكوين CORS</h3>
                        <p className="text-muted-foreground mb-4">
                          تأكد من تكوين إعدادات CORS في Supabase للسماح لدومينك الجديد:
                        </p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li className="text-muted-foreground">انتقل إلى "API" ثم "Settings"</li>
                          <li className="text-muted-foreground">في قسم "API Settings"، أضف دومينك إلى "Additional Allowed Origins"</li>
                          <li className="text-muted-foreground">احفظ التغييرات</li>
                        </ol>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">الخطوة 4: اختبار الاتصال بقاعدة البيانات</h3>
                        <p className="text-muted-foreground mb-2">
                          بعد النشر، تأكد من اختبار وظائف قاعدة البيانات:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                          <li className="text-muted-foreground">اختبر تسجيل الدخول وإنشاء حساب جديد</li>
                          <li className="text-muted-foreground">تأكد من إمكانية إنشاء وتعديل البيانات</li>
                          <li className="text-muted-foreground">اختبر استرجاع البيانات وعرضها بشكل صحيح</li>
                          <li className="text-muted-foreground">تحقق من عمل جميع وظائف API المخصصة</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DeploymentGuide;
