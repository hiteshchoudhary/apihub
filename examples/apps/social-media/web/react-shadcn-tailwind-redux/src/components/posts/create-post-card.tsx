import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Image } from "lucide-react";
import { Button } from "../ui/button";

const CreatePostCard = () => {
  return (
    <Card className="w-full mb-3">
      <CardContent className="pt-2">
        <Input
          placeholder="share your thoughts..."
          className=" bg-transparent border-none outline-none ring-0 focus:border-none focus:ring-0 focus-visible:ring-0 placeholder:opacity-65"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Image className="w-5 h-5 md:w-6 md:h-6 text-zinc-500" />
        <Button className="text-sm md:text-base">Post</Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePostCard;
