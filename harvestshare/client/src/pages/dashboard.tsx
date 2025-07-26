import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { TreePine, Apple, Star, Handshake, Search, Plus, UserPen, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Property, type Deal } from "@shared/schema";

export default function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const { data: userProperties = [] } = useQuery({
    queryKey: ['/api/users', currentUser.id, 'properties'],
    enabled: !!currentUser.id && currentUser.userType === 'landowner',
  });

  const { data: userDeals = [] } = useQuery({
    queryKey: ['/api/users', currentUser.id, 'deals'],
    enabled: !!currentUser.id,
  });

  const { data: userApplications = [] } = useQuery({
    queryKey: ['/api/users', currentUser.id, 'applications'],
    enabled: !!currentUser.id && currentUser.userType === 'harvester',
  });

  if (!currentUser.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Please log in to access your dashboard</p>
            <Link href="/register">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalHarvests = (userDeals as Deal[]).filter((deal: Deal) => deal.status === 'completed').length;
  const activeDeals = (userDeals as Deal[]).filter((deal: Deal) => deal.status === 'active').length;
  const totalFruitsHarvested = (userDeals as Deal[])
    .filter((deal: Deal) => deal.status === 'completed' && deal.actualYield)
    .reduce((sum: number, deal: Deal) => sum + parseFloat(deal.actualYield || '0'), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser.fullName}!
          </h1>
          <p className="text-gray-600">Track your harvest activities and manage your {currentUser.userType === 'landowner' ? 'properties' : 'applications'}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary text-sm font-medium">
                    {currentUser.userType === 'landowner' ? 'Properties Listed' : 'Total Harvests'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentUser.userType === 'landowner' ? (userProperties as Property[]).length : totalHarvests}
                  </p>
                </div>
                <TreePine className="text-primary text-2xl" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-harvest-50 to-harvest-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-harvest text-sm font-medium">
                    {currentUser.userType === 'landowner' ? 'Total Deals' : 'Fruits Harvested'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentUser.userType === 'landowner' ? (userDeals as Deal[]).length : `${totalFruitsHarvested.toFixed(0)} kg`}
                  </p>
                </div>
                <Apple className="text-harvest text-2xl" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentUser.rating || '0.0'}
                  </p>
                </div>
                <Star className="text-blue-600 text-2xl" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Active Deals</p>
                  <p className="text-2xl font-bold text-gray-900">{activeDeals}</p>
                </div>
                <Handshake className="text-green-600 text-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity / Properties */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentUser.userType === 'landowner' ? 'Your Properties' : 'Recent Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentUser.userType === 'landowner' ? (
                  <div className="space-y-4">
                    {(userProperties as Property[]).length === 0 ? (
                      <div className="text-center py-8">
                        <TreePine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">You haven't listed any properties yet</p>
                        <Link href="/add-property">
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            List Your First Property
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      (userProperties as Property[]).map((property: Property) => (
                        <div key={property.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg">
                            {property.images && property.images.length > 0 ? (
                              <img 
                                src={property.images[0]} 
                                alt={property.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <TreePine className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{property.title}</p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {property.address}
                            </p>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge variant="secondary">{property.fruitType}</Badge>
                              <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                                {property.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Harvest Share</p>
                            <p className="text-lg font-semibold text-primary">{property.harvesterShare}%</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(userDeals as Deal[]).slice(0, 5).map((deal: Deal) => (
                      <div key={deal.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Handshake className="text-white h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Deal #{deal.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(deal.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          deal.status === 'active' ? 'default' : 
                          deal.status === 'completed' ? 'secondary' : 'destructive'
                        }>
                          {deal.status}
                        </Badge>
                      </div>
                    ))}
                    
                    {(userDeals as Deal[]).length === 0 && (
                      <div className="text-center py-8">
                        <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No harvest activity yet</p>
                        <Link href="/browse-properties">
                          <Button>
                            <Search className="mr-2 h-4 w-4" />
                            Find Properties to Harvest
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Upcoming */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentUser.userType === 'landowner' ? (
                  <>
                    <Link href="/add-property" className="block">
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        List New Property
                      </Button>
                    </Link>
                    <Link href="/deals" className="block">
                      <Button variant="outline" className="w-full">
                        <Handshake className="mr-2 h-4 w-4" />
                        Manage Deals
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/browse-properties" className="block">
                      <Button className="w-full">
                        <Search className="mr-2 h-4 w-4" />
                        Find New Properties
                      </Button>
                    </Link>
                    <Link href="/deals" className="block">
                      <Button variant="outline" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        View My Deals
                      </Button>
                    </Link>
                  </>
                )}
                <Button variant="outline" className="w-full">
                  <UserPen className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Harvests */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Harvests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userDeals
                    .filter((deal: Deal) => deal.status === 'active')
                    .slice(0, 3)
                    .map((deal: Deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Deal #{deal.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-yellow-600 text-sm">Active</span>
                      </div>
                    ))}
                  
                  {userDeals.filter((deal: Deal) => deal.status === 'active').length === 0 && (
                    <p className="text-gray-500 text-sm">No upcoming harvests</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
