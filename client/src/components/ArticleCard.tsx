import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageSquare } from "lucide-react";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  commentCount: number;
  featured?: boolean;
}

export default function ArticleCard({
  id,
  title,
  excerpt,
  date,
  readTime,
  commentCount,
  featured = false,
}: ArticleCardProps) {
  return (
    <Link href={`/article/${id}`} data-testid={`link-article-${id}`}>
      <Card className="h-full hover-elevate active-elevate-2 cursor-pointer transition-shadow">
        <CardHeader>
          {featured && (
            <Badge className="mb-2 w-fit" data-testid={`badge-featured-${id}`}>
              Featured
            </Badge>
          )}
          <h3 className="text-xl font-semibold leading-tight" data-testid={`text-title-${id}`}>
            {title}
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground" data-testid={`text-excerpt-${id}`}>
            {excerpt}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1" data-testid={`text-date-${id}`}>
              <Calendar className="h-4 w-4" />
              {date}
            </div>
            <div className="flex items-center gap-1" data-testid={`text-readtime-${id}`}>
              <Clock className="h-4 w-4" />
              {readTime}
            </div>
            <div className="flex items-center gap-1" data-testid={`text-comments-${id}`}>
              <MessageSquare className="h-4 w-4" />
              {commentCount} comments
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
