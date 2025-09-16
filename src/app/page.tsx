'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Sparkles,
  Loader2,
  MapPin,
  Users,
  Building,
  Ruler,
  Info,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { extractDimensionsAction } from './actions';

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: 'Project name must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  familyMembers: z.coerce.number().min(1, {
    message: 'Must have at least 1 family member.',
  }),
  roofLength: z.coerce.number().positive({
    message: 'Roof length must be a positive number.',
  }),
  roofWidth: z.coerce.number().positive({
    message: 'Roof width must be a positive number.',
  }),
  tankSpaceLength: z.coerce.number().positive({
    message: 'Available length must be a positive number.',
  }),
  tankSpaceWidth: z.coerce.number().positive({
    message: 'Available width must be a positive number.',
  }),
});

export default function AssessmentPage() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [blueprintDataUri, setBlueprintDataUri] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      location: '',
      familyMembers: 1,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBlueprintDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBlueprintDataUri(null);
    }
  };

  const handleExtractDimensions = async () => {
    if (!blueprintDataUri) {
      toast({
        variant: 'destructive',
        title: 'No Blueprint Selected',
        description: 'Please upload a blueprint image first.',
      });
      return;
    }

    setIsExtracting(true);
    try {
      const result = await extractDimensionsAction(blueprintDataUri);
      if (result.error) {
        throw new Error(result.error);
      }
      form.setValue('roofLength', result.length ?? 0);
      form.setValue('roofWidth', result.width ?? 0);
      toast({
        title: 'Dimensions Extracted!',
        description: `Length: ${result.length}m, Width: ${result.width}m.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: errorMessage,
      });
    } finally {
      setIsExtracting(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams(
      Object.entries(values).map(([key, value]) => [key, String(value)])
    );
    router.push(`/assessment?${params.toString()}`);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">
            RTRWH Potential Assessment
          </CardTitle>
          <CardDescription className="text-base">
            Assess Rooftop Rainwater Harvesting and Artificial Recharge Potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Input</TabsTrigger>
              <TabsTrigger value="automatic" disabled>
                Automatic (GIS)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 mt-6"
                >
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-primary">
                      Project Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="e.g., Green Valley Apartments" {...field} className="pl-9" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                             <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="e.g., Delhi, India" {...field} className="pl-9" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="familyMembers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Family Members</FormLabel>
                             <FormControl>
                              <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="e.g., 4" {...field} className="pl-9" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-primary">
                      Building Dimensions
                    </h3>
                    <div className="p-4 bg-primary/10 rounded-lg space-y-4">
                      <FormLabel>Upload Building Blueprint</FormLabel>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                           <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input id="blueprint" type="file" onChange={handleFileChange} accept="image/*" className="pl-9" />
                        </div>
                        <Button
                          type="button"
                          onClick={handleExtractDimensions}
                          disabled={isExtracting || !blueprintDataUri}
                          className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                          {isExtracting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                          )}
                          Extract with AI
                        </Button>
                      </div>
                       <FormDescription>
                          Upload a blueprint and our AI will extract the rooftop dimensions for you.
                       </FormDescription>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormField
                        control={form.control}
                        name="roofLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Roof Length (meters)</FormLabel>
                             <FormControl>
                              <div className="relative">
                                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="Enter length" {...field} className="pl-9"/>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="roofWidth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Roof Width (meters)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="Enter width" {...field} className="pl-9" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                   <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-primary">
                      Available Space for Tank
                    </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormField
                        control={form.control}
                        name="tankSpaceLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length (meters)</FormLabel>
                             <FormControl>
                              <div className="relative">
                                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="Enter length" {...field} className="pl-9"/>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tankSpaceWidth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width (meters)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="Enter width" {...field} className="pl-9" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full text-lg py-6" size="lg">
                    Get Assessment
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="automatic">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Coming Soon!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our GIS-powered automatic assessment feature is under
                    development. It will allow you to get instant potential
                    analysis using satellite imagery. Stay tuned!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
       <Card className="mt-8 bg-primary/10">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                  <Info className="h-5 w-5"/>
                  Water Conservation Tips
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
              <p>💧 Fix leaky faucets and toilets promptly to save hundreds of liters a week.</p>
              <p>💧 Use a broom instead of a hose to clean driveways and sidewalks.</p>
              <p>💧 Collect rainwater not just for groundwater recharge, but also for gardening and cleaning.</p>
          </CardContent>
      </Card>
    </div>
  );
}
