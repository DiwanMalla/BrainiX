import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hash, TrendingUp } from "lucide-react";
import Link from "next/link";

// These would typically come from your database
const categories = [
  {
    id: "tech",
    name: "Technology",
    description: "Latest in tech, programming, and software development",
    count: 156,
    trending: true,
  },
  {
    id: "education",
    name: "Education",
    description: "Teaching methodologies, learning resources, and academic insights",
    count: 89,
    trending: true,
  },
  {
    id: "career",
    name: "Career Growth",
    description: "Professional development, job hunting, and workplace tips",
    count: 67,
    trending: false,
  },
  {
    id: "tutorials",
    name: "Tutorials",
    description: "Step-by-step guides and how-to articles",
    count: 234,
    trending: true,
  },
  {
    id: "news",
    name: "Industry News",
    description: "Latest updates and trends in various industries",
    count: 112,
    trending: false,
  },
  {
    id: "personal-growth",
    name: "Personal Growth",
    description: "Self-improvement, productivity, and lifestyle",
    count: 98,
    trending: false,
  },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
        <p className="text-lg text-muted-foreground">
          Explore our diverse collection of topics and find the content that interests you
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="group hover:shadow-lg transition-shadow">
            <Link href={`/blog/categories/${category.id}`}>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  {category.trending && (
                    <Badge variant="secondary">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.count} articles
                  </span>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    View articles →
                  </Button>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
