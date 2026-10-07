import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Articles from "@/pages/Articles";
import About from "@/pages/About";
import Article from "@/pages/Article";
import Tools from "@/pages/Tools";
import TrademarkPrecheckPage from "@/pages/tools/TrademarkPrecheckPage";
import SerpPreviewPage from "@/pages/tools/SerpPreviewPage";
import EeatSchemaGeneratorPage from "@/pages/tools/EeatSchemaGeneratorPage";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/articles" component={Articles} />
      <Route path="/about" component={About} />
      <Route path="/article/:slug" component={Article} />
      <Route path="/tools" component={Tools} />
      {/* One route per tool rather than a dynamic slug: each tool is its own
          component, and an unknown /tools/* slug should 404 rather than render
          an empty shell. */}
      <Route path="/tools/trademark-precheck" component={TrademarkPrecheckPage} />
      <Route path="/tools/serp-preview" component={SerpPreviewPage} />
      <Route path="/tools/eeat-schema-generator" component={EeatSchemaGeneratorPage} />
      <Route path="/terms">{() => <Legal slug="terms" />}</Route>
      <Route path="/privacy">{() => <Legal slug="privacy" />}</Route>
      <Route path="/affiliate-disclosure">{() => <Legal slug="affiliate-disclosure" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
