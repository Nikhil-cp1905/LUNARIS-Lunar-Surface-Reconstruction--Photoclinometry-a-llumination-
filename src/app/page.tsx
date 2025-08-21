import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { images } from '@/lib/data';

export default function DashboardPage() {
  const totalDatasets = images.length;

  return (
    <div className="flex flex-col h-screen">
      <Header title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Datasets
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDatasets}</div>
              <p className="text-xs text-muted-foreground">
                Available image datasets for processing.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
