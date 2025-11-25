import { Router } from "wouter";
import ArticleCard from "../ArticleCard";

export default function ArticleCardExample() {
  return (
    <Router>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ArticleCard
          id="1"
          title="Advanced Link Building Strategies You Haven't Used"
          excerpt="Discover unique, creative ways to build high-quality backlinks that your competitors aren't using."
          date="Nov 20, 2025"
          readTime="12 min read"
          commentCount={127}
          featured
        />
        <ArticleCard
          id="2"
          title="The State of SEO in 2025"
          excerpt="An in-depth analysis of current SEO trends and what's working right now."
          date="Nov 15, 2025"
          readTime="8 min read"
          commentCount={89}
        />
        <ArticleCard
          id="3"
          title="Content Marketing That Actually Drives Traffic"
          excerpt="Proven strategies for creating content that ranks and converts."
          date="Nov 10, 2025"
          readTime="10 min read"
          commentCount={54}
        />
      </div>
    </Router>
  );
}
