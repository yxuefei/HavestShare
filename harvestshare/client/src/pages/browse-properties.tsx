import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, MapPin, Star, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApplicationSchema, type Property, type User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/ui/star-rating";
import { Map } from "@/components/ui/map";
import { z } from "zod";

const applicationSchema = insertApplicationSchema.extend({
  preferredDates: z.array(z.string()).default([]),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const fruitTypes = ["All fruits", "Apples", "Pears", "Cherries", "Plums", "Peaches", "Berries"];

export default function BrowseProperties() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyOwner, setPropertyOwner] = useState<User | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    fruitType: "All fruits",
    distance: "25",
  });

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Fetch properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  // Fetch property owner when property is selected
  const { data: owner } = useQuery({
    queryKey: ['/api/users', selectedProperty?.ownerId],
    enabled: !!selectedProperty?.ownerId,
  });

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      propertyId: "",
      message: "",
      preferredDates: [],
      hasExperience: false,
      hasEquipment: false,
      isFlexible: false,
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (data: ApplicationFormData & { harvesterId: string }) => {
      const response = await apiRequest('POST', '/api/applications', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application sent!",
        description: "The landowner will review your application and get back to you.",
      });
      setSelectedProperty(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send application",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    form.setValue('propertyId', property.id);
  };

  const onSubmit = (data: ApplicationFormData) => {
    if (!currentUser.id) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to apply for harvest opportunities",
        variant: "destructive",
      });
      setLocation('/register');
      return;
    }

    applyMutation.mutate({
      ...data,
      harvesterId: currentUser.id,
    });
  };

  const filteredProperties = (properties as Property[]).filter((property: Property) => {
    const matchesLocation = !searchFilters.location || 
      property.address.toLowerCase().includes(searchFilters.location.toLowerCase());
    
    const matchesFruitType = searchFilters.fruitType === "All fruits" ||
      property.fruitType === searchFilters.fruitType;

    return matchesLocation && matchesFruitType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Harvest Opportunities</h1>
          <p className="text-gray-600">Find properties near you that need harvesting</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Input
                placeholder="Enter city or zip code"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fruit Type</label>
              <Select 
                value={searchFilters.fruitType} 
                onValueChange={(value) => setSearchFilters({ ...searchFilters, fruitType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fruitTypes.map((fruit) => (
                    <SelectItem key={fruit} value={fruit}>
                      {fruit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
              <Select 
                value={searchFilters.distance}
                onValueChange={(value) => setSearchFilters({ ...searchFilters, distance: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                  <SelectItem value="25">Within 25 miles</SelectItem>
                  <SelectItem value="50">Within 50 miles</SelectItem>
                  <SelectItem value="100">Within 100 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {filteredProperties.map((property: Property) => (
            <Card 
              key={property.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handlePropertyClick(property)}
            >
              <div className="aspect-video bg-gray-200 rounded-t-lg">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {property.title}
                  </h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.address}
                </p>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {property.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Your share:</span>
                    <span className="font-semibold text-primary ml-1">
                      {property.harvesterShare}%
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Harvest:</span>
                    <span className="font-semibold ml-1">
                      {new Date(property.harvestStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                      {new Date(property.harvestEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{property.fruitType}</Badge>
                  {property.preferredQualities?.slice(0, 2).map((quality, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {quality}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full">
                  View Details & Apply
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties found matching your criteria.</p>
          </div>
        )}

        {/* Property Detail Modal */}
        <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedProperty && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedProperty.title}</DialogTitle>
                </DialogHeader>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    {/* Property Images */}
                    {selectedProperty.images && selectedProperty.images.length > 0 && (
                      <div className="mb-6">
                        <img 
                          src={selectedProperty.images[0]} 
                          alt={selectedProperty.title}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Property Details */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Property Details</h4>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedProperty.address}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <StarRating rating={4.8} readonly size="sm" />
                          <span className="ml-2 text-gray-600">4.8 (12 reviews)</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{selectedProperty.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">Harvest Information</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Fruit Type:</span>
                            <span>{selectedProperty.fruitType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Harvest Period:</span>
                            <span>
                              {new Date(selectedProperty.harvestStartDate).toLocaleDateString()} - 
                              {new Date(selectedProperty.harvestEndDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated Yield:</span>
                            <span>{selectedProperty.estimatedYield} {selectedProperty.yieldUnit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Your Share:</span>
                            <span className="font-semibold text-primary">{selectedProperty.harvesterShare}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">Preferred Qualities</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedProperty.preferredQualities?.map((quality, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {quality}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Map */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Location</h5>
                      <Map
                        latitude={parseFloat(selectedProperty.latitude)}
                        longitude={parseFloat(selectedProperty.longitude)}
                        readonly
                        className="h-48 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                      <h5 className="font-semibold text-gray-900 mb-4">Apply to Harvest</h5>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message to landowner</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    rows={4}
                                    placeholder="Tell the landowner about your experience and why you'd be a good harvester..."
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="hasExperience"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={!!field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    I have harvest experience
                                  </FormLabel>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="hasEquipment"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={!!field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    I have my own equipment
                                  </FormLabel>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="isFlexible"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={!!field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    Flexible with timing
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={applyMutation.isPending}
                          >
                            {applyMutation.isPending ? (
                              "Sending Application..."
                            ) : (
                              "Send Application"
                            )}
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
