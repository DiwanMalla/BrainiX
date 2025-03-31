export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "John Doe",
      testimonial:
        "This course helped me transition into a new career, and I feel more confident in my skills.",
      course: "Web Development Bootcamp",
      image: "/path-to-image.jpg",
    },
    {
      name: "Jane Smith",
      testimonial:
        "The learning materials were great, and the instructors were really supportive throughout the course.",
      course: "AI Fundamentals",
      image: "/path-to-image.jpg",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              What Our Students Say
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Hear from our community of learners who have transformed their
              careers.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="text-lg font-semibold text-center">
                {testimonial.testimonial}
              </p>
              <div className="mt-4 text-center">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.course}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
