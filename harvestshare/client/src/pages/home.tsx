import { Link } from "wouter";
import { Apple, Search, TreePine, Users, Handshake, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-harvest-100 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
              Connect. Harvest. <span className="text-primary">Share.</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Turn unused fruit trees into shared abundance. Landowners connect with harvesters for a win-win solution that reduces waste and builds community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/add-property">
                <Button size="lg" className="transform hover:scale-105">
                  <TreePine className="mr-2" />
                  List Your Property
                </Button>
              </Link>
              <Link href="/browse-properties">
                <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary-50">
                  <Search className="mr-2" />
                  Find Harvest Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Selector */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">How Would You Like to Get Started?</h2>
            <p className="text-lg text-gray-600">Choose your role to access the right tools and opportunities</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-transparent hover:border-primary transition-all cursor-pointer transform hover:scale-105">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <TreePine className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">I'm a Landowner</h3>
                  <p className="text-gray-700 mb-6">I have fruit trees or bushes that need harvesting</p>
                  <ul className="text-sm text-gray-600 text-left space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="text-primary mr-2">✓</span>List your property for free
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">✓</span>Set your own harvest share
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">✓</span>Choose reliable harvesters
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">✓</span>Rate and review experiences
                    </li>
                  </ul>
                  <Link href="/register?type=landowner" className="block">
                    <Button className="w-full">Register as Landowner</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-harvest-100 to-harvest-200 border-2 border-transparent hover:border-harvest transition-all cursor-pointer transform hover:scale-105">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-harvest rounded-full flex items-center justify-center mx-auto mb-4">
                    <Apple className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">I'm a Harvester</h3>
                  <p className="text-gray-700 mb-6">I want to harvest fresh fruits and help landowners</p>
                  <ul className="text-sm text-gray-600 text-left space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="text-harvest mr-2">✓</span>Find harvest opportunities nearby
                    </li>
                    <li className="flex items-center">
                      <span className="text-harvest mr-2">✓</span>Keep your share of the harvest
                    </li>
                    <li className="flex items-center">
                      <span className="text-harvest mr-2">✓</span>Build your reputation
                    </li>
                    <li className="flex items-center">
                      <span className="text-harvest mr-2">✓</span>Connect with local community
                    </li>
                  </ul>
                  <Link href="/register?type=harvester" className="block">
                    <Button className="w-full bg-harvest hover:bg-harvest-600">Register as Harvester</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to connect and harvest</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Connect</h3>
              <p className="text-gray-600">Landowners list their properties, harvesters browse and apply</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Agree</h3>
              <p className="text-gray-600">Negotiate terms, set dates, and finalize harvest agreements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Review</h3>
              <p className="text-gray-600">Complete harvest, share fruits, and rate your experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <TreePine className="text-primary text-2xl mr-2" />
                <span className="font-heading font-bold text-xl">HarvestShare</span>
              </div>
              <p className="text-gray-400 mb-4">Connecting landowners and harvesters to reduce food waste and build community through shared abundance.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Harvesters</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/browse-properties" className="hover:text-white transition-colors">Find Properties</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Landowners</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/add-property" className="hover:text-white transition-colors">List Property</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">Best Practices</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HarvestShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
