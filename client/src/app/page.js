'use client';
import Link from 'next/link';
import { BackgroundBeams } from '@/components/ui/background-beam';
import { Homepage } from '@/components/Homepage';
const navigation = [
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
  { name: 'skills', href: '/skills' },


];

export default function Home() {
  return (
      <div className="flex flex-col items-center h-screen w-full rounded-md bg-neutral-950 relative antialiased">
        <Homepage />
        <BackgroundBeams className='w-screen h-screen' />
      </div>
  );
}
