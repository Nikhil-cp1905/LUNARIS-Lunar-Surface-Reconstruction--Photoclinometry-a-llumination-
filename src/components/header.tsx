import { type ReactNode } from 'react';

type HeaderProps = {
  title: string;
  children?: ReactNode;
};

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-8">
      <h1 className="text-xl font-semibold pl-12 lg:pl-0">{title}</h1>
      {children && <div className="flex items-center gap-4">{children}</div>}
    </header>
  );
}
