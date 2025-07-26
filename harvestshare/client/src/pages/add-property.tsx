import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { TreePine, Upload, Calendar, DollarSign, Check } from "lucide-react";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { Map } from "@/components/ui/map";
import { z } from "zod";

const propertySchema = insertPropertySchema.extend({
  harvesterShare: z.number().min(1).max(100),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const fruitTypes = [
  "Apples",
  "Pears", 
  "Cherries",
  "Plums",
  "Peaches",
  "Apricots",
  "Citrus",
  "Berries",
  "Mixed Fruits",
  "Other"
];

const preferredQualities = [
  "Experienced",
  "Local",
  "Has equipment",
  "Flexible schedule",
  "Family-friendly",
  "Eco-conscious"
];

export default function AddProperty() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      fruitType: "",
      address: "",
      latitude: "38.5",
      longitude: "-122.8",
      accessInstructions: "",
      harvestStartDate: "",
      harvestEndDate: "",
      ownerShare: 30,
      harvesterShare: 70,
      estimatedYield: "0",
      yieldUnit: "kg",
      images: [],
      preferredQualities: [],
      specialRequirements: "",
    },
  });

  const createPropertyMutation = useMutation({
    mutationFn: async (data: PropertyFormData & { ownerId: string }) => {
      const response = await apiRequest('POST', '/api/properties', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Property listed successfully!",
        description: "Your property is now available for harvest applications.",
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Failed to list property",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleOwnerShareChange = (value: string) => {
    const ownerShare = parseInt(value);
    const harvesterShare = 100 - ownerShare;
    form.setValue('ownerShare', ownerShare);
    form.setValue('harvesterShare', harvesterShare);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    form.setValue('latitude', lat.toString());
    form.setValue('longitude', lng.toString());
  };

  const onSubmit = (data: PropertyFormData) => {
    if (!currentUser.id) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to list a property",
        variant: "destructive",
      });
      return;
    }

    createPropertyMutation.mutate({
      ...data,
      ownerId: currentUser.id,
      images,
      preferredQualities: selectedQualities,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/add-property" />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TreePine className="mr-2 text-primary" />
              List Your Property
            </CardTitle>
            <CardDescription>
              Share details about your fruit trees or bushes that need harvesting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Apple Orchard in Sunny Valley" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fruitType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fruit Type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fruit type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fruitTypes.map((fruit) => (
                                <SelectItem key={fruit} value={fruit}>
                                  {fruit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4}
                            placeholder="Describe your property, the fruit trees, and any special instructions..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Location
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accessInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access Instructions</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Gate code, parking instructions" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormLabel>Mark Location on Map</FormLabel>
                    <Map 
                      latitude={coordinates?.lat}
                      longitude={coordinates?.lng}
                      onLocationSelect={handleLocationSelect}
                      className="h-64 rounded-lg border border-gray-300 mt-2"
                    />
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Photos
                  </h3>
                  <ImageUpload onImagesChange={setImages} />
                </div>

                {/* Harvest Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Harvest Details
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="harvestStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harvest Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="harvestEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harvest End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="ownerShare"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Share (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              placeholder="30"
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value) || 0);
                                handleOwnerShareChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <p className="text-sm text-gray-500">Percentage of harvest you keep</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="harvesterShare"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harvester Share (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              readOnly
                              value={field.value}
                            />
                          </FormControl>
                          <p className="text-sm text-gray-500">Automatically calculated</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormLabel>Estimated Harvest Amount</FormLabel>
                    <div className="flex space-x-2 mt-2">
                      <FormField
                        control={form.control}
                        name="estimatedYield"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                type="number"
                                placeholder="50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="yieldUnit"
                        render={({ field }) => (
                          <FormItem>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="lbs">lbs</SelectItem>
                                <SelectItem value="baskets">baskets</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Harvester Preferences */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Harvester Preferences
                  </h3>
                  
                  <div>
                    <FormLabel className="mb-3 block">
                      Preferred harvester qualities (select all that apply)
                    </FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {preferredQualities.map((quality) => (
                        <div key={quality} className="flex items-center space-x-2">
                          <Checkbox
                            id={quality}
                            checked={selectedQualities.includes(quality)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedQualities([...selectedQualities, quality]);
                              } else {
                                setSelectedQualities(selectedQualities.filter(q => q !== quality));
                              }
                            }}
                          />
                          <label htmlFor={quality} className="text-sm text-gray-700">
                            {quality}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="specialRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={3}
                            placeholder="Any special requirements or restrictions for harvesters..."
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setLocation('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createPropertyMutation.isPending}
                  >
                    {createPropertyMutation.isPending ? (
                      "Publishing..."
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Publish Property
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
