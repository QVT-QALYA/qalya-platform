import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import SurveyPage from "@/pages/SurveyPage";
import ThankYouPage from "@/pages/ThankYouPage";
import AdminPage from "@/pages/AdminPage";
import ReportPage from "@/pages/ReportPage";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/survey/:slug" component={SurveyPage} />
          <Route path="/survey/:slug/done" component={ThankYouPage} />
          <Route path="/survey/:slug/report" component={ReportPage} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
