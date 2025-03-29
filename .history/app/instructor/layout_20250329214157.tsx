import { cn } from "@/lib/utils"; // Import Tailwind class helper if needed

interface InstructorSidebarProps {
  isSheet?: boolean; // Detect if it's inside a Sheet (mobile view)
}

export function InstructorSidebar({ isSheet }: InstructorSidebarProps) {
  return (
    <aside className={cn("h-full w-64 bg-gray-100 p-4", isSheet && "pt-8")}>
      {/* Hide this section when inside a Sheet */}
      {!isSheet && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl font-bold">BrainiX</span>
        </div>
      )}

      {/* Sidebar navigation */}
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="/dashboard" className="block p-2">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/courses" className="block p-2">
              Courses
            </a>
          </li>
          <li>
            <a href="/settings" className="block p-2">
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
