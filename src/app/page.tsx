
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  MapPin,
  Users,
  Building,
  Ruler,
  Info,
  LocateFixed,
  Loader2,
  Upload,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
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
import { extractDimensionsFromBlueprint } from '@/app/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  blueprint: z.any().optional(),
  rooftopType: z.string({
    required_error: "Please select a rooftop type."
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
  const router = useRouter();
  const { toast } = useToast();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [blueprintPreview, setBlueprintPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      location: '',
      familyMembers: 4,
      roofLength: 0,
      roofWidth: 0,
      tankSpaceLength: 0,
      tankSpaceWidth: 0,
    },
  });

  function handleGetCurrentLocation(isAutomatic = false) {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
      });
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        form.setValue('location', locationString, { shouldValidate: true });
        setIsFetchingLocation(false);
        toast({
          title: 'Location Fetched',
          description: 'Your current location has been filled in.',
        });
        if(isAutomatic) {
            // Simulate fetching data from GIS
            toast({
                title: "Analyzing Satellite Data...",
                description: "This is a simulation. In a real app, we'd fetch GIS data."
            });
            form.setValue('projectName', 'My Automated Project');
            form.setValue('rooftopType', 'flat');
            form.setValue('roofLength', 15);
            form.setValue('roofWidth', 10);
            form.setValue('tankSpaceLength', 5);
            form.setValue('tankSpaceWidth', 4);
        }
      },
      (error) => {
        setIsFetchingLocation(false);
        toast({
          variant: 'destructive',
          title: 'Unable to Fetch Location',
          description: error.message || 'Please ensure location services are enabled.',
        });
      }
    );
  }
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams(
      Object.entries(values).map(([key, value]) => [key, String(value)])
    );
    router.push(`/assessment?${params.toString()}`);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
        <div className="w-full max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline text-primary">
                Hydronix
              </CardTitle>
              <CardDescription className="text-base">
                Assess Rooftop Rainwater Harvesting and Artificial Recharge Potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Input</TabsTrigger>
                  <TabsTrigger value="automatic">
                    Automatic (GIS)
                  </TabsTrigger>
                </TabsList>
                <Form {...form}>
                <TabsContent value="manual">
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
                                  <div className="relative flex items-center">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="e.g., Delhi, India" {...field} className="pl-9 pr-12" />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                      onClick={() => handleGetCurrentLocation(false)}
                                      disabled={isFetchingLocation}
                                      aria-label="Get current location"
                                    >
                                      {isFetchingLocation ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <LocateFixed className="h-4 w-4" />
                                      )}
                                    </Button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="rooftopType"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Rooftop Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a rooftop type" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="flat">Flat / Terrace</SelectItem>
                                                <SelectItem value="sloped">Sloped</SelectItem>
                                                <SelectItem value="tiled">Tiled</SelectItem>
                                                <SelectItem value="metal">Metal Sheet</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                        Generate Report
                      </Button>
                    </form>
                </TabsContent>
                <TabsContent value="automatic">
                    <div className="mt-6 text-center">
                        <p className="mb-4">Click the button to use your current location to automatically assess rainwater harvesting potential.</p>
                        <Button onClick={() => handleGetCurrentLocation(true)} disabled={isFetchingLocation} size="lg">
                            {isFetchingLocation ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <LocateFixed className="mr-2 h-4 w-4" />
                            )}
                            Get Assessment with Current Location
                        </Button>

                        {form.watch('location') && form.watch('roofLength') > 0 && (
                             <Card className="mt-6 text-left">
                                <CardHeader>
                                    <CardTitle>Automatic Assessment Ready</CardTitle>
                                    <CardDescription>We've estimated your details based on your location. You can now generate the report.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><span className="font-semibold">Location:</span> {form.watch('location')}</div>
                                        <div><span className="font-semibold">Roof Area:</span> {form.watch('roofLength')}m x {form.watch('roofWidth')}m</div>
                                        <div><span className="font-semibold">Family Members:</span> {form.watch('familyMembers')}</div>
                                        <div><span className="font-semibold">Rooftop Type:</span> {form.watch('rooftopType')}</div>
                                    </div>
                                </CardContent>
                                <CardContent>
                                    <Button onClick={form.handleSubmit(onSubmit)} className="w-full">
                                        Generate Full Report
                                    </Button>
                                </CardContent>
                             </Card>
                        )}
                    </div>
                </TabsContent>
                </Form>
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
    </div>
  );
}
