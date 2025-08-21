import Image from 'next/image';
import { Header } from '@/components/header';
import { UploadDialog } from '@/components/upload-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { images } from '@/lib/data';
import type { Image as ImageType } from '@/lib/types';

export default function DatasetsPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header title="Datasets">
        <UploadDialog />
      </Header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Image Datasets</CardTitle>
            <CardDescription>
              Browse and manage raw lunar imagery from various missions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Thumb</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Mission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image: ImageType) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <div className="relative w-16 h-10 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={image.thumbnailUrl}
                          alt={image.filename}
                          fill
                          className="object-cover"
                          data-ai-hint="moon surface"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{image.filename}</TableCell>
                    <TableCell>{image.mission}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-{images.length}</strong> of <strong>{images.length}</strong> datasets
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
