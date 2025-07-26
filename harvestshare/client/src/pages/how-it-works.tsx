import { Link } from "wouter";
import { TreePine, Users, Handshake, Star, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <TreePine className="text-primary text-2xl mr-2" />
                  <span className="font-heading font-bold text-xl text-gray-900">HarvestShare</span>
                </Link>
              </div>
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                <Link href="/browse-properties" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  Browse Properties
                </Link>
                <Link href="/how-it-works" className="text-primary px-3 py-2 text-sm font-medium transition-colors">
                  How It Works
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  About
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/register" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-harvest-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            How HarvestShare Works
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            A simple 4-step process to connect landowners with harvesters for mutual benefit
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="text-white text-2xl" />
                </div>
                <CardTitle className="text-lg">1. List Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Landowners create a listing with property details, fruit types, harvest dates, and profit sharing terms.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-harvest rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white text-2xl" />
                </div>
                <CardTitle className="text-lg">2. Apply to Harvest</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Harvesters browse properties and submit applications with their experience and availability.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Handshake className="text-white text-2xl" />
                </div>
                <CardTitle className="text-lg">3. Create Deal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Landowners review applications and create deals with selected harvesters, setting harvest schedules.
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-harvest rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-white text-2xl" />
                </div>
                <CardTitle className="text-lg">4. Rate & Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  After successful harvests, both parties rate each other to build trust and reputation in the community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Landowners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
                For Landowners
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">No Upfront Costs</h3>
                    <p className="text-gray-600">List your property for free and only share profits when you harvest.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">You Set the Terms</h3>
                    <p className="text-gray-600">Choose your profit share percentage and approve harvesters you trust.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Reduce Waste</h3>
                    <p className="text-gray-600">Turn unused fruit into profit while helping your community.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Build Relationships</h3>
                    <p className="text-gray-600">Connect with experienced harvesters and build long-term partnerships.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/register?type=landowner">
                  <Button size="lg" className="mr-4">
                    Register as Landowner
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Example Profit Share</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Harvest:</span>
                  <span className="font-semibold">500 lbs apples</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Value:</span>
                  <span className="font-semibold">$750</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-primary">
                    <span>Your Share (30%):</span>
                    <span className="font-semibold">$225</span>
                  </div>
                  <div className="flex justify-between text-harvest">
                    <span>Harvester Share (70%):</span>
                    <span className="font-semibold">$525</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Harvesters */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Harvester Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="text-harvest mr-2" size={16} />
                  <span>Keep 60-80% of harvest value</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-harvest mr-2" size={16} />
                  <span>Choose your own schedule</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-harvest mr-2" size={16} />
                  <span>Work close to home</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-harvest mr-2" size={16} />
                  <span>Build harvesting reputation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-harvest mr-2" size={16} />
                  <span>Connect with local farmers</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
                For Harvesters
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Whether you're an experienced harvester or just getting started, HarvestShare connects you with local opportunities to earn money while helping reduce food waste.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
                  <p className="text-gray-600">
                    Create your profile, browse available properties, and apply to those that match your skills and schedule.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Building Reputation</h3>
                  <p className="text-gray-600">
                    Complete harvests successfully and receive positive ratings to access better opportunities and higher profit shares.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/register?type=harvester">
                  <Button size="lg" variant="outline" className="border-2 border-harvest text-harvest hover:bg-harvest-50">
                    Register as Harvester
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-harvest">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white mb-8">
            Join the HarvestShare community today and start connecting with local harvest opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse-properties">
              <Button size="lg" variant="secondary">
                Browse Properties
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}