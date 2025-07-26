import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { MessageSquare, Star, CheckCircle, Calendar, MapPin, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type Deal, type Property, type User, type Message } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/ui/star-rating";
import { z } from "zod";

const messageSchema = insertMessageSchema;
const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

type MessageFormData = z.infer<typeof messageSchema>;
type RatingFormData = z.infer<typeof ratingSchema>;

export default function Deals() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [dealProperty, setDealProperty] = useState<Property | null>(null);
  const [dealPartner, setDealPartner] = useState<User | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Fetch user deals
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['/api/users', currentUser.id, 'deals'],
    enabled: !!currentUser.id,
  });

  // Fetch messages for selected deal
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/deals', selectedDeal?.id, 'messages'],
    enabled: !!selectedDeal?.id,
  });

  // Fetch property and partner info when deal is selected
  const { data: property } = useQuery({
    queryKey: ['/api/properties', selectedDeal?.propertyId],
    enabled: !!selectedDeal?.propertyId,
  });

  const { data: partner } = useQuery({
    queryKey: ['/api/users', selectedDeal ? (currentUser.userType === 'landowner' ? selectedDeal.harvesterId : selectedDeal.ownerId) : null],
    enabled: !!selectedDeal,
  });

  const messageForm = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      dealId: "",
      senderId: currentUser.id,
      content: "",
    },
  });

  const ratingForm = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 5,
      review: "",
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormData) => {
      const response = await apiRequest('POST', '/api/messages', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Your message has been delivered.",
      });
      messageForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/deals', selectedDeal?.id, 'messages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const completeDealMutation = useMutation({
    mutationFn: async (dealId: string) => {
      const response = await apiRequest('PATCH', `/api/deals/${dealId}`, {
        status: 'completed',
        completedAt: new Date().toISOString().split('T')[0],
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Deal marked as complete!",
        description: "You can now rate your experience.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUser.id, 'deals'] });
      setShowRating(true);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to complete deal",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const submitRatingMutation = useMutation({
    mutationFn: async (data: RatingFormData) => {
      const ratingField = currentUser.userType === 'landowner' ? 'ownerRating' : 'harvesterRating';
      const reviewField = currentUser.userType === 'landowner' ? 'ownerReview' : 'harvesterReview';
      
      const response = await apiRequest('PATCH', `/api/deals/${selectedDeal?.id}`, {
        [ratingField]: data.rating,
        [reviewField]: data.review,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Rating submitted!",
        description: "Thank you for your feedback.",
      });
      setShowRating(false);
      setSelectedDeal(null);
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUser.id, 'deals'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit rating",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    messageForm.setValue('dealId', deal.id);
  };

  const handleShowMessages = (deal: Deal) => {
    setSelectedDeal(deal);
    messageForm.setValue('dealId', deal.id);
    setShowMessages(true);
  };

  const onSendMessage = (data: MessageFormData) => {
    sendMessageMutation.mutate(data);
  };

  const onSubmitRating = (data: RatingFormData) => {
    submitRatingMutation.mutate(data);
  };

  if (!currentUser.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Please log in to view your deals</p>
            <Button onClick={() => setLocation('/register')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading deals...</p>
      </div>
    );
  }

  const activeDeals = deals.filter((deal: Deal) => deal.status === 'active');
  const completedDeals = deals.filter((deal: Deal) => deal.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Deals</h1>
          <p className="text-gray-600">Manage your ongoing and completed harvest agreements</p>
        </div>

        {deals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No deals yet</h2>
              <p className="text-gray-600 mb-6">
                {currentUser.userType === 'landowner' 
                  ? "Start by listing a property to connect with harvesters"
                  : "Browse available properties to start your first harvest"
                }
              </p>
              <Button onClick={() => setLocation(currentUser.userType === 'landowner' ? '/add-property' : '/browse-properties')}>
                {currentUser.userType === 'landowner' ? 'List Property' : 'Browse Properties'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Active Deals */}
            {activeDeals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Deals</h2>
                <div className="space-y-4">
                  {activeDeals.map((deal: Deal) => (
                    <Card key={deal.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              Deal #{deal.id.slice(0, 8)}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm space-x-4">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <UserIcon className="h-4 w-4 mr-1" />
                                {currentUser.userType === 'landowner' ? 'Harvester' : 'Landowner'}: {deal.ownerId !== currentUser.id ? 'Owner' : 'Harvester'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="default">Active</Badge>
                            <p className="text-sm text-gray-500 mt-1">
                              Share: {currentUser.userType === 'landowner' ? deal.ownerShare : deal.harvesterShare}%
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShowMessages(deal)}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Messages
                            </Button>
                          </div>
                          <Button
                            onClick={() => completeDealMutation.mutate(deal.id)}
                            disabled={completeDealMutation.isPending}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Complete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Deals */}
            {completedDeals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Deals</h2>
                <div className="space-y-4">
                  {completedDeals.map((deal: Deal) => {
                    const userRating = currentUser.userType === 'landowner' ? deal.ownerRating : deal.harvesterRating;
                    const userReview = currentUser.userType === 'landowner' ? deal.ownerReview : deal.harvesterReview;
                    const needsRating = !userRating;

                    return (
                      <Card key={deal.id} className="border-l-4 border-green-500">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Deal #{deal.id.slice(0, 8)}
                              </h3>
                              <div className="flex items-center text-gray-600 text-sm space-x-4">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Completed {deal.completedAt ? new Date(deal.completedAt).toLocaleDateString() : ''}
                                </span>
                                {deal.actualYield && (
                                  <span>
                                    Yield: {deal.actualYield} kg
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">Completed</Badge>
                              <p className="text-sm text-gray-500 mt-1">
                                Share: {currentUser.userType === 'landowner' ? deal.ownerShare : deal.harvesterShare}%
                              </p>
                            </div>
                          </div>

                          {needsRating ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Rate Your Experience</h4>
                              <Form {...ratingForm}>
                                <form onSubmit={ratingForm.handleSubmit(onSubmitRating)} className="space-y-3">
                                  <FormField
                                    control={ratingForm.control}
                                    name="rating"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Overall Rating</FormLabel>
                                        <FormControl>
                                          <StarRating
                                            rating={field.value}
                                            onRatingChange={field.onChange}
                                            size="md"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={ratingForm.control}
                                    name="review"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Comments (Optional)</FormLabel>
                                        <FormControl>
                                          <Textarea
                                            rows={2}
                                            placeholder="Share your experience..."
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button
                                    type="submit"
                                    size="sm"
                                    disabled={submitRatingMutation.isPending}
                                  >
                                    {submitRatingMutation.isPending ? "Submitting..." : "Submit Rating"}
                                  </Button>
                                </form>
                              </Form>
                            </div>
                          ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">You rated this experience:</p>
                                  <div className="flex items-center mt-1">
                                    <StarRating rating={userRating} readonly size="sm" />
                                    <span className="ml-2 text-sm text-gray-600">({userRating}/5)</span>
                                  </div>
                                  {userReview && (
                                    <p className="text-sm text-gray-700 mt-2">"{userReview}"</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages Modal */}
        <Dialog open={showMessages} onOpenChange={setShowMessages}>
          <DialogContent className="max-w-2xl max-h-[70vh]">
            <DialogHeader>
              <DialogTitle>Messages - Deal #{selectedDeal?.id.slice(0, 8)}</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col h-96">
              <div className="flex-1 overflow-y-auto space-y-3 p-4 border rounded-lg bg-gray-50">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center">No messages yet</p>
                ) : (
                  messages.map((message: Message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg max-w-xs ${
                        message.senderId === currentUser.id
                          ? 'ml-auto bg-primary text-white'
                          : 'mr-auto bg-white border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.createdAt!).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              
              <Form {...messageForm}>
                <form onSubmit={messageForm.handleSubmit(onSendMessage)} className="flex space-x-2 mt-4">
                  <FormField
                    control={messageForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Type your message..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={sendMessageMutation.isPending}
                  >
                    Send
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
