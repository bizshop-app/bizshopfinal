import { Star, Quote, CheckCircle } from "lucide-react";
import { ScrollAnimation } from "./scroll-animation";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "BizShop transformed my small pottery business. I went from selling at local markets to shipping nationwide. The platform is so easy to use—I had my store up in a weekend!",
      author: "Sarah Johnson",
      company: "Earthen Creations",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      rating: 5
    },
    {
      quote: "The analytics tools helped me understand what products were selling best, allowing me to optimize my inventory. My online sales increased by 200% in just six months!",
      author: "David Chen",
      company: "Urban Thread Apparel",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      rating: 5
    },
    {
      quote: "As someone with zero technical skills, I was amazed at how quickly I could set up my online bakery. The customer support team was incredibly helpful whenever I had questions.",
      author: "Maria Rodriguez",
      company: "Sweet Delights Bakery",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      rating: 4.5
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-accent text-accent" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-5 w-5 fill-accent text-accent" />);
    }
    
    return stars;
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animationType="fadeInUp">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full px-6 py-2 text-sm font-medium text-yellow-700 mb-6">
              <Star className="w-4 h-4 mr-2" />
              Customer Love
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-yellow-900 to-orange-900 bg-clip-text text-transparent">
              What Our Customers
              <span className="block bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Say About Us
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what successful store owners have to say about their BizShop experience.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimation 
              key={index} 
              animationType="fadeInUp" 
              delay={index * 150}
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:scale-105 relative overflow-hidden">
                {/* Decorative gradient top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                
                {/* Quote icon */}
                <div className="absolute top-6 right-6 text-gray-200 group-hover:text-gray-300 transition-colors">
                  <Quote className="h-8 w-8" />
                </div>

                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="w-16 h-16 rounded-full mr-4 border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{testimonial.author}</h3>
                    <p className="text-gray-600 font-medium">{testimonial.company}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 leading-relaxed text-lg font-medium">
                  "{testimonial.quote}"
                </blockquote>

                {/* Hover effect decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-5 group-hover:h-full transition-all duration-500 -z-10"></div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
