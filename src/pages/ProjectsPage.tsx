
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Code, FolderPlus, Clock, Copy, Edit, Trash2, Eye, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useProjects, Project } from '@/contexts/ProjectContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProjectsPage = () => {
  const { projects, addProject, removeProject } = useProjects();
  const [newProjectName, setNewProjectName] = React.useState('');
  const [newProjectDescription, setNewProjectDescription] = React.useState('');
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  
  const recentProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.lastModified);
    const dateB = new Date(b.lastModified);
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 5);
  
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المشروع",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      description: newProjectDescription.trim() || undefined,
      lastModified: new Date(),
      files: [], // Initial empty files
    };

    addProject(newProject);
    setNewProjectName('');
    setNewProjectDescription('');
    setCreateDialogOpen(false);
    
    toast({
      title: "تم إنشاء المشروع",
      description: `تم إنشاء مشروع جديد: ${newProjectName}`,
      duration: 2000,
    });
  };
  
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      removeProject(projectId);
      
      toast({
        title: "تم حذف المشروع",
        description: "تم حذف المشروع بنجاح",
        duration: 2000,
      });
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        html="" 
        css="" 
        js=""
        script=""
        isDarkMode={false}
        toggleDarkMode={() => {}}
        onSave={() => {}}
      />
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">إدارة المشاريع</h1>
            <p className="text-muted-foreground">استعرض وإدارة المشاريع الخاصة بك</p>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  إنشاء مشروع جديد
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إنشاء مشروع جديد</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل المشروع الجديد الذي تريد إنشاءه.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">اسم المشروع</Label>
                    <Input
                      id="name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="أدخل اسم المشروع"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">وصف المشروع (اختياري)</Label>
                    <Input
                      id="description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="أدخل وصف المشروع"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="button" onClick={handleCreateProject}>
                    إنشاء
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button asChild variant="outline">
              <Link to="/">
                <Code className="mr-2 h-4 w-4" />
                العودة للمحرر
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">جميع المشاريع</TabsTrigger>
            <TabsTrigger value="recent">المشاريع الأخيرة</TabsTrigger>
            <TabsTrigger value="templates">قوالب جاهزة</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {projects.length === 0 ? (
              <Card className="text-center p-6">
                <div className="py-10 px-6">
                  <h3 className="text-lg font-medium">لا توجد مشاريع بعد</h3>
                  <p className="text-muted-foreground mt-2">أنشئ مشروعك الأول للبدء</p>
                  <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    إنشاء مشروع جديد
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle className="truncate">{project.name}</CardTitle>
                      <CardDescription>
                        {project.description || 'لا يوجد وصف'}
                      </CardDescription>
                      <div className="absolute top-3 right-3 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 ml-1" />
                          {formatDate(new Date(project.lastModified))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        عدد الملفات: {project.files.length || 0}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-1 rtl:space-x-reverse">
                        <Button variant="ghost" size="icon" title="حذف">
                          <Trash2 
                            className="h-4 w-4 text-destructive" 
                            onClick={() => handleDeleteProject(project.id)}
                          />
                        </Button>
                        <Button variant="ghost" size="icon" title="تعديل">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="نسخ">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-x-1 rtl:space-x-reverse">
                        <Button variant="ghost" size="icon" title="تنزيل">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button asChild>
                          <Link to="/">
                            <Eye className="mr-2 h-4 w-4" />
                            فتح
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent">
            {recentProjects.length === 0 ? (
              <Card className="text-center p-6">
                <div className="py-10 px-6">
                  <h3 className="text-lg font-medium">لا توجد مشاريع حديثة</h3>
                  <p className="text-muted-foreground mt-2">ستظهر هنا المشاريع التي تم فتحها مؤخرًا</p>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentProjects.map(project => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>
                        {project.description || 'لا يوجد وصف'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        تم التعديل: {formatDate(new Date(project.lastModified))}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to="/">
                          <Eye className="mr-2 h-4 w-4" />
                          فتح
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['موقع ويب', 'تطبيق React', 'لوحة تحكم', 'متجر إلكتروني', 'حاسبة', 'محرر نصوص'].map((template, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{template}</CardTitle>
                    <CardDescription>
                      قالب جاهز للاستخدام
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-24 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                      معاينة القالب
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      استخدام القالب
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProjectsPage;
