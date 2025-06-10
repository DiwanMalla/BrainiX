"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, MessageSquare, TrendingUp, Clock } from "lucide-react";

export function BlogFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  function onFilterChange(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("filter", value);
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      defaultValue={searchParams.get("filter") || "recent"}
      onValueChange={onFilterChange}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Filter posts" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Recent
          </div>
        </SelectItem>
        <SelectItem value="popular">
          <div className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Popular
          </div>
        </SelectItem>
        <SelectItem value="trending">
          <div className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trending
          </div>
        </SelectItem>
        <SelectItem value="discussed">
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Most Discussed
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
