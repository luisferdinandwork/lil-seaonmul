import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const DATA = [
  {
    quote: "Absolutely lovely! The pastel aesthetic is charming and the packaging is thoughtful.",
    author: "Maya",
    rating: 5,
    location: "Jakarta",
  },
  {
    quote: "Perfect balance—feminine yet neutral. Great for gifting without feeling too flashy.",
    author: "Tara",
    rating: 4,
    location: "Bandung",
  },
  {
    quote: "Fast response on WhatsApp and beautiful products. Will order again!",
    author: "Nadia",
    rating: 5,
    location: "Surabaya",
  },
]

export function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-secondary/30 to-background">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our lovely customers have to say about their experience with Lil.Seonmul.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {DATA.map((testimonial, idx) => (
            <Card 
              key={idx} 
              className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border bg-card overflow-hidden group"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-pretty flex-grow mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                
                {/* Author Info */}
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Join our happy customers today!</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://wa.me/6282154359140?text=Hi%20Lil.Seonmul%21%20I%27d%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90"
            >
              Order Now
            </a>
            <a
              href="https://shopee.co.id/litty.kitty10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Visit Shopee
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}