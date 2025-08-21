'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowDownUp, Download, FlaskConical } from 'lucide-react';

interface AnalysisResult {
  original: string;
  dem: {
    imageUri: string;
    description: string;
    minElevation: number;
    maxElevation: number;
  };
  photoclinometry: string;
}

export default function AnalysisPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('analysisResult');
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch (error) {
        console.error("Failed to parse analysis results from session storage", error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleDownloadDem = () => {
    if (!result?.dem.imageUri) return;
    const link = document.createElement('a');
    link.href = result.dem.imageUri;
    link.download = 'generated-dem.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Header title="Analysis Results" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle><Skeleton className="h-6 w-40" /></CardTitle></CardHeader>
              <CardContent><Skeleton className="aspect-video w-full" /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle><Skeleton className="h-6 w-40" /></CardTitle></CardHeader>
              <CardContent><Skeleton className="aspect-video w-full" /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle><Skeleton className="h-6 w-40" /></CardTitle></CardHeader>
              <CardContent><Skeleton className="aspect-video w-full" /></CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col h-screen">
        <Header title="Analysis Results" />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-muted p-4 rounded-full">
              <FlaskConical className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">No Analysis Data Found</h2>
            <p className="text-muted-foreground max-w-sm">
              It looks like you haven't run an analysis yet. Please upload an image from the Datasets page to get started.
            </p>
            <Button asChild>
                <Link href="/datasets">Go to Datasets</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title="Analysis Results" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Original Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative bg-muted">
                {result.original ? (
                  <Image
                    src={result.original}
                    alt="Original lunar surface"
                    fill
                    className="object-contain"
                    data-ai-hint="moon surface"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Image not available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle>Generated DEM</CardTitle>
              <CardDescription>Topographic Analysis</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
              <div className="aspect-video relative bg-muted">
                {result.dem.imageUri ? (
                  <Image
                    src={result.dem.imageUri}
                    alt="Generated Digital Elevation Model"
                    fill
                    className="object-contain"
                    data-ai-hint="topography map"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Image not available
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{result.dem.description}</p>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <ArrowDownUp className="h-4 w-4 text-primary" />
                        <span className="font-medium">Elevation Range:</span>
                    </div>
                    {result.dem && typeof result.dem.minElevation === 'number' && typeof result.dem.maxElevation === 'number' ? (
                      <span className="text-foreground">{result.dem.minElevation.toFixed(2)}m to {result.dem.maxElevation.toFixed(2)}m</span>
                    ) : (
                      <span className="text-muted-foreground">Not available</span>
                    )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleDownloadDem} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download DEM
              </Button>
            </CardFooter>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Generated Photoclinometry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative bg-muted">
                {result.photoclinometry ? (
                  <Image
                    src={result.photoclinometry}
                    alt="Generated Photoclinometry Image"
                    fill
                    className="object-contain"
                    data-ai-hint="grayscale texture"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Image not available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
