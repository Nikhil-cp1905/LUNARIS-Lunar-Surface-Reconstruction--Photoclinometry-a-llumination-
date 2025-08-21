"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLunarImagery } from '@/ai/flows/generate-lunar-imagery-flow';

const fileToDataUri = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Could not read file.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });

const formSchema = z.object({
  mission: z.enum(['Chandrayaan-TMC', 'NASA LRO', 'JAXA SELENE'], {
    required_error: 'Please select a mission.',
  }),
  imageFile: z
    .any()
    .refine((file): file is File => file instanceof File && !!file, 'An image file is required.')
    .refine((file) => file.size <= 4 * 1024 * 1024, `Max file size is 4MB.`)
    .refine(
      (file) => ['image/jpeg', 'image/png'].includes(file.type),
      'Only .jpg and .png files are accepted.'
    ),
  incidence: z.coerce.number().min(0).max(90),
  emission: z.coerce.number().min(0).max(90),
  phase: z.coerce.number().min(0).max(180),
});

export function UploadDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidence: 45,
      emission: 10,
      phase: 55,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const photoDataUri = await fileToDataUri(values.imageFile);

      toast({
        title: 'Processing Image...',
        description: 'AI is generating the DEM and Photoclinometry images. This may take a moment.',
      });

      const result = await generateLunarImagery({ photoDataUri });

      sessionStorage.setItem('analysisResult', JSON.stringify({
        original: photoDataUri,
        dem: result.dem,
        photoclinometry: result.photoclinometryImageUri,
      }));

      toast({
        title: 'Analysis Complete',
        description: 'Redirecting to the results page.',
      });
      
      router.push('/analysis');
      setIsOpen(false);
      form.reset();

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not process the image. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload & Analyze
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Upload Image for Analysis</DialogTitle>
          <DialogDescription>
            Upload a raw lunar image to generate a DEM and Photoclinometry map.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mission</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a mission" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Chandrayaan-TMC">
                        Chandrayaan-TMC
                      </SelectItem>
                      <SelectItem value="NASA LRO">NASA LRO</SelectItem>
                      <SelectItem value="JAXA SELENE">JAXA SELENE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Image File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={(e) =>
                        onChange(e.target.files ? e.target.files[0] : null)
                      }
                      {...rest}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="incidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incidence (°)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emission (°)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase (°)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Analysis
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
