"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Moon,
  Home,
  Layers,
  FlaskConical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Datasets', href: '/datasets', icon: Layers },
  { name: 'Analysis', href: '/analysis', icon: FlaskConical },
];

function NavContent() {
  const pathname = usePathname();
  return (
    <>
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Moon className="h-6 w-6 text-primary" />
          <span className="text-lg">LunarSight</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-4 py-4 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                pathname === item.href && 'bg-accent text-primary'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <>
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          <NavContent />
        </div>
      </aside>
      <div className="lg:hidden absolute top-4 left-4 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 flex flex-col p-0 bg-card">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
