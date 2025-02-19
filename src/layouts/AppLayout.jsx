import { Outlet } from 'react-router';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { AppSidebar } from '@/components/layouts/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { AIAssistant } from '@/pages/ai-assistant';
import './globals.css';

export default function AppLayout() {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider className="min-h-screen">
      <AppSidebar />
      <Toaster />
      <div className="flex py-2 flex-col w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className={`${isMobile ? 'self-end fixed' : 'self-start'}`}/>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ctrl + b</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <main className="flex-grow flex items-center justify-center">
          <Outlet />
          <AIAssistant />
        </main>
      </div>
    </SidebarProvider>
  );
}
