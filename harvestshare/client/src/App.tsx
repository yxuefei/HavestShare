import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Register from "@/pages/register";
import AddProperty from "@/pages/add-property";
import BrowseProperties from "@/pages/browse-properties";
import Dashboard from "@/pages/dashboard";
import Deals from "@/pages/deals";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/add-property" component={AddProperty} />
      <Route path="/browse-properties" component={BrowseProperties} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/deals" component={Deals} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
