
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Environment {
  id: string;
  name: string;
  icon: string;
}

interface EnvironmentGroup {
  id: string;
  name: string;
  environments: Environment[];
}

interface EnvironmentSelectorProps {
  groups: EnvironmentGroup[];
  selectedEnvironment: string;
  onSelect: (environmentId: string) => void;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  groups,
  selectedEnvironment,
  onSelect
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>بيئات المحاكاة المتاحة</CardTitle>
        <CardDescription>اختر من بين بيئات المحاكاة المتعددة لتشغيل الكود</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={groups[0].id}>
          <TabsList className="mb-4">
            {groups.map(group => (
              <TabsTrigger key={group.id} value={group.id}>{group.name}</TabsTrigger>
            ))}
          </TabsList>
          
          {groups.map(group => (
            <TabsContent key={group.id} value={group.id}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {group.environments.map(env => (
                  <Button 
                    key={env.id}
                    variant={selectedEnvironment === env.id ? "secondary" : "outline"}
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => onSelect(env.id)}
                  >
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center mb-2 text-xs font-bold">
                      {env.icon}
                    </div>
                    <span>{env.name}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnvironmentSelector;
