import { Link } from "wouter";
import { TreePine, Heart, Users, Globe, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
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
                <Link href="/how-it-works" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  How It Works
                </Link>
                <Link href="/about" className="text-primary px-3 py-2 text-sm font-medium transition-colors">
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
            About HarvestShare
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Connecting communities through shared harvests, reducing food waste, and building sustainable local food systems.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                HarvestShare was born from a simple observation: millions of pounds of fresh fruit go unharvested every year while communities struggle with food access and economic opportunities.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that by connecting landowners with willing harvesters, we can create a win-win solution that reduces waste, provides income opportunities, and strengthens local food systems.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Community First</h3>
                  <p className="text-gray-600">Building connections that last beyond the harvest season.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-harvest-100 p-8 rounded-lg">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">Our Impact</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-sm text-gray-600">Pounds of fruit rescued</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-harvest mb-2">500+</div>
                  <div className="text-sm text-gray-600">Successful harvests</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">200+</div>
                  <div className="text-sm text-gray-600">Active members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-harvest mb-2">$75K+</div>
                  <div className="text-sm text-gray-600">Shared revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-white text-2xl" />
                </div>
                <CardTitle>Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Reducing food waste and promoting local food systems that benefit both people and the planet.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-harvest rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white text-2xl" />
                </div>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Building lasting relationships between neighbors and creating opportunities for meaningful connections.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-white text-2xl" />
                </div>
                <CardTitle>Fairness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ensuring fair compensation for all parties and transparent, honest dealings in every transaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Our Story</h2>
          </div>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              HarvestShare started when our founder, Sarah, noticed the apple trees in her neighborhood dropping fruit every fall. Meanwhile, her friend Marcus was looking for ways to supplement his income while staying active outdoors.
            </p>
            <p>
              The solution seemed obvious: connect landowners like Sarah's neighbors with motivated harvesters like Marcus. But finding these connections and managing the arrangements was complicated.
            </p>
            <p>
              That's when we built HarvestShare - a platform that makes it easy for landowners to list their unharvested fruit and for harvesters to find opportunities in their area. Since launching, we've facilitated hundreds of successful harvests and prevented thousands of pounds of fresh fruit from going to waste.
            </p>
            <p>
              Today, HarvestShare operates across multiple communities, connecting neighbors and building a more sustainable local food system one harvest at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-600">Have questions? We'd love to hear from you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Mail className="text-primary mx-auto mb-4" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600">hello@harvestshare.com</p>
                <p className="text-gray-600">support@harvestshare.com</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Phone className="text-primary mx-auto mb-4" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600">(555) 123-FRUIT</p>
                <p className="text-gray-600">Mon-Fri 9am-5pm</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <MapPin className="text-primary mx-auto mb-4" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600">123 Community Lane</p>
                <p className="text-gray-600">Portland, OR 97201</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-harvest">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Join the HarvestShare Community
          </h2>
          <p className="text-xl text-white mb-8">
            Be part of the solution. Start connecting with local harvest opportunities today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}