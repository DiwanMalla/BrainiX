import { BookOpen, Globe, Laptop } from "lucide-react";

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Laptop,
    title: "Learn Anywhere",
    description: "Access courses on any device, anytime, anywhere.",
  },
  {
    icon: BookOpen,
    title: "Expert Instructors",
    description:
      "Learn from industry professionals with real-world experience.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Connect with learners and instructors from around the world.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <span className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Why Choose BrainiX
            </span>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Learn Without Limits
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Our platform offers everything you need to advance your career and
              expand your knowledge.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
