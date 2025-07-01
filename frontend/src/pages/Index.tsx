import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  MapPin,
  Car,
  FileText,
  Package,
  Star,
  Users,
  Phone,
  Mail,
  Play,
  ChevronLeft,
  ChevronRight,
  Camera,
} from "lucide-react";
import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from '@/components/Navbar';

const Index = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useState(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const galleryItems = [
    {
      type: "video",
      title: "Desert Safari Adventure",
      description:
        "Experience the magic of Sahara Desert with our luxury tours",
      thumbnail:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d68811?w=800&h=600&fit=crop&crop=center",
      category: "Experience",
    },
    {
      type: "image",
      title: "Marrakech Medina",
      description: "Explore the vibrant souks and ancient architecture",
      src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop&crop=center",
      category: "Destination",
    },
    {
      type: "image",
      title: "Luxury Riad Stay",
      description: "Traditional Moroccan hospitality in stunning riads",
      src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop&crop=center",
      category: "Accommodation",
    },
    {
      type: "video",
      title: "Atlas Mountains Journey",
      description: "Breathtaking landscapes and Berber culture",
      thumbnail:
        "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800&h=600&fit=crop&crop=center",
      category: "Adventure",
    },
    {
      type: "image",
      title: "Casablanca Hassan II Mosque",
      description: "Architectural marvel by the Atlantic Ocean",
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d68811?w=800&h=600&fit=crop&crop=center",
      category: "Culture",
    },
    {
      type: "image",
      title: "Essaouira Coastal Beauty",
      description: "Wind-swept beaches and charming medina",
      src: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop&crop=center",
      category: "Destination",
    },
    {
      type: "video",
      title: "Customer Stories",
      description: "Hear from travelers who experienced Morocco with us",
      thumbnail:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=center",
      category: "Testimonial",
    },
    {
      type: "image",
      title: "Premium Car Fleet",
      description: "Luxury vehicles for your comfortable journey",
      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&crop=center",
      category: "Service",
    },
    {
      type: "image",
      title: "Fez Traditional Crafts",
      description: "Artisanal workshops and ancient traditions",
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d68811?w=800&h=600&fit=crop&crop=center",
      category: "Culture",
    },
  ];

  const services = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Visa Services",
      description:
        "Expert assistance with visa applications and documentation for seamless travel to Morocco.",
      features: [
        "Tourist Visa",
        "Business Visa",
        "Student Visa",
        "Express Processing",
      ],
      color: "from-rose-500 to-orange-500",
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Car Rental",
      description:
        "Premium fleet of vehicles to explore Morocco at your own pace with full insurance coverage.",
      features: [
        "Luxury Cars",
        "4WD Vehicles",
        "Airport Pickup",
        "GPS Navigation",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Live in Morocco",
      description:
        "Complete relocation services to help you settle and thrive in beautiful Morocco.",
      features: [
        "Property Search",
        "Legal Support",
        "Cultural Integration",
        "24/7 Assistance",
      ],
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Full Package",
      description:
        "All-inclusive travel packages combining accommodation, transport, and exclusive experiences.",
      features: [
        "Luxury Hotels",
        "Private Tours",
        "Desert Safari",
        "Cultural Experiences",
      ],
      color: "from-purple-500 to-pink-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Nomad",
      content:
        "MoroccoTravel made my visa process incredibly smooth. Their team was professional and handled everything perfectly.",
      rating: 5,
    },
    {
      name: "Ahmed Hassan",
      role: "Business Owner",
      content:
        "The car rental service was exceptional. Clean vehicles, fair pricing, and excellent customer support throughout my trip.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Expat Resident",
      content:
        "Moving to Morocco seemed daunting until I found their relocation services. They made it feel like home from day one.",
      rating: 5,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-moroccan-primary/10 via-moroccan-secondary/5 to-moroccan-accent/10" />
          <div
            className={
              'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d97706" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-30'
            }
          />

          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge
                variant="secondary"
                className="mb-6 bg-moroccan-primary/10 text-moroccan-primary border-moroccan-primary/20"
              >
                Discover Morocco with Expert Guidance
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                Your Gateway to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-moroccan-primary via-moroccan-secondary to-moroccan-accent">
                  Magical Morocco
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                From visa assistance to luxury accommodations, we provide
                comprehensive travel solutions that transform your Moroccan dreams
                into unforgettable experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-moroccan-primary hover:bg-moroccan-primary/90 text-white px-8"
                >
                  Explore Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-moroccan-primary text-moroccan-primary hover:bg-moroccan-primary/5"
                >
                  Plan Your Journey
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          id="services"
          className="py-24 bg-gradient-to-b from-background to-moroccan-primary/5"
        >
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Our Premium Services
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive solutions designed to make your Moroccan journey
                seamless and extraordinary
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                  />
                  <CardHeader className="relative">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white mb-4`}
                    >
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-moroccan-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-moroccan-primary group-hover:text-white transition-colors"
                      onClick={() => {
                        if (service.title === "Visa Services") navigate('/services/visa');
                        else if (service.title === "Car Rental") navigate('/services/car-rental');
                        else if (service.title === "Live in Morocco") navigate('/services/live-in-morocco');
                        else if (service.title === "Full Package") navigate('/services/full-package');
                      }}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section
          id="gallery"
          className="py-24 bg-gradient-to-b from-moroccan-primary/5 to-background"
        >
          <div className="container">
            <div className="text-center mb-16">
              <Badge
                variant="secondary"
                className="mb-6 bg-moroccan-accent/10 text-moroccan-accent border-moroccan-accent/20"
              >
                <Camera className="mr-2 h-4 w-4" />
                Visual Stories
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Discover Morocco Through Our Lens
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From breathtaking landscapes to unforgettable experiences, see why
                Morocco captivates every traveler's heart
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {galleryItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex-[0_0_90%] md:flex-[0_0_45%] lg:flex-[0_0_30%] pl-4"
                    >
                      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-80">
                        <div className="relative w-full h-full">
                          <img
                            src={
                              item.type === "video" ? item.thumbnail : item.src
                            }
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                          {/* Video Play Button */}
                          {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-moroccan-primary/80 transition-all duration-300">
                                <Play className="h-8 w-8 text-white fill-white" />
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <Badge
                              variant="secondary"
                              className="mb-3 bg-moroccan-primary/20 text-white border-moroccan-primary/30 backdrop-blur-sm"
                            >
                              {item.category}
                            </Badge>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-moroccan-secondary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-white/90 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-moroccan-primary/0 group-hover:bg-moroccan-primary/10 transition-all duration-300" />
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollPrev}
                  className="rounded-full h-12 w-12 p-0 border-moroccan-primary/20 hover:bg-moroccan-primary hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                {/* Dots indicator */}
                <div className="flex gap-2">
                  {galleryItems.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        index === selectedIndex
                          ? "bg-moroccan-primary w-8"
                          : "bg-moroccan-primary/30 hover:bg-moroccan-primary/50"
                      }`}
                      onClick={() => emblaApi?.scrollTo(index)}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollNext}
                  className="rounded-full h-12 w-12 p-0 border-moroccan-primary/20 hover:bg-moroccan-primary hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="bg-moroccan-primary hover:bg-moroccan-primary/90 text-white"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  View Full Gallery
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-moroccan-primary text-white">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">5K+</div>
                <div className="text-moroccan-primary/80">Happy Travelers</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">98%</div>
                <div className="text-moroccan-primary/80">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">24/7</div>
                <div className="text-moroccan-primary/80">Support</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">50+</div>
                <div className="text-moroccan-primary/80">Destinations</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                What Our Clients Say
              </h2>
              <p className="text-xl text-muted-foreground">
                Real experiences from travelers who trusted us with their Moroccan
                journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-moroccan-secondary text-moroccan-secondary"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-moroccan-primary to-moroccan-secondary flex items-center justify-center text-white font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-moroccan-primary to-moroccan-secondary text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Explore Morocco?
              </h2>
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                Join thousands of satisfied travelers who have discovered the
                magic of Morocco with our expert guidance. Your adventure awaits!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-moroccan-primary hover:bg-white/90"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Speak to an Expert
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="py-16 bg-background border-t">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-moroccan-primary to-moroccan-secondary flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-moroccan-primary">
                    MoroccoTravel
                  </span>
                </div>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Your trusted partner for unforgettable Moroccan experiences. We
                  specialize in making your travel dreams a reality with
                  personalized service and expert guidance.
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    info@moroccotravel.com
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    +212 123 456 789
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Services</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a
                      href="#"
                      className="hover:text-moroccan-primary transition-colors"
                    >
                      Visa Processing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-moroccan-primary transition-colors"
                    >
                      Car Rental
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-moroccan-primary transition-colors"
                    >
                      Relocation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-moroccan-primary transition-colors"
                    >
                      Travel Packages
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a
                      href="#"
                      className="hover:text-moroccan-primary transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-moroccan-primary transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-moroccan-primary transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-moroccan-primary transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
              © 2024 MoroccoTravel. All rights reserved. Made with ❤️ for
              travelers who dream big.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
