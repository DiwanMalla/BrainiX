"use client";

import { useS    try {
      await deletePost(id);
      toast({
        title: "Post deleted",
        description: "Your blog post has been deleted successfully.",
      });
      setOpen(false);
      router.push("/blog");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not delete post. Please try again later.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error deleting post:", error);act";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
// import { deletePost } from "@/lib/blog/action";
import { useToast } from "@/hooks/use-toast";

export function DeletePostButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // await deletePost(id);
      toast({
        title: "Post deleted",
        description: "Your blog post has been deleted successfully.",
      });
      setOpen(false);
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete post. Please try again later.",
        variant: "destructive",
      });
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your blog
            post and all its comments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
