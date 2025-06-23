// components/news/NewsCard.tsx
import { NewsArticle } from '@/types/news';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard = ({ article }: NewsCardProps) => {
  const publishedDate = new Date(article.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative">
          {article.urlToImage && (
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <ExternalLink className="w-4 h-4 text-white bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {article.source.name}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {timeAgo}
            </div>
          </div>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="pt-0">
          {article.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {article.description}
            </p>
          )}
          {article.author && (
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="w-3 h-3 mr-1" />
              {article.author}
            </div>
          )}
        </CardContent>
      </a>
    </Card>
  );
};
