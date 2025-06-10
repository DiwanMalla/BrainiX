
import Image from "next/image";
import { Button } from "@/components/ui/button";

const jobs = [
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote / Kathmandu",
    description: "Build beautiful, performant UIs with React and Next.js.",
    link: "mailto:careers@brainix.com?subject=Frontend Developer Application",
  },
  {
    title: "Backend Developer",
    type: "Full-time",
    location: "Remote / Kathmandu",
    description: "Design robust APIs and scalable backend systems.",
    link: "mailto:careers@brainix.com?subject=Backend Developer Application",
  },
  {
    title: "UI/UX Designer",
    type: "Contract",
    location: "Remote",
    description: "Craft delightful user experiences and modern interfaces.",
    link: "mailto:careers@brainix.com?subject=UI/UX Designer Application",
  },
];

export default function CareersPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Join the BrainiX Team</h1>
          <p className="text-lg text-muted-foreground">
            Help us shape the future of online learning. We’re looking for passionate, creative, and driven people to join our mission.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/web-development.png"
            alt="Careers at BrainiX"
            width={320}
            height={220}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>
      </section>

      {/* About Section */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Why Work With Us?</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
          <li>Flexible remote work and supportive team culture</li>
          <li>Opportunities for growth and learning</li>
          <li>Impactful work in the EdTech space</li>
          <li>Competitive compensation and benefits</li>
        </ul>
      </section>

      {/* Open Positions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Open Positions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.title} className="border rounded-lg p-6 bg-background shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-1">{job.title}</h3>
                <div className="flex gap-2 text-xs mb-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">{job.type}</span>
                  <span className="bg-muted px-2 py-1 rounded">{job.location}</span>
                </div>
                <p className="text-muted-foreground mb-4">{job.description}</p>
              </div>
              <Button asChild className="w-full mt-auto">
                <a href={job.link} target="_blank" rel="noopener noreferrer">
                  Apply Now
                </a>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Application Instructions */}
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">How to Apply</h2>
        <p className="text-muted-foreground">
          Send your CV and a short cover letter to <a href="mailto:careers@brainix.com" className="text-primary underline">careers@brainix.com</a>.
          Please include the job title in your email subject. We look forward to hearing from you!
        </p>
      </section>
    </main>
  );
}
