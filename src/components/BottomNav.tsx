'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()
  const item = (href:string,label:string)=> (
    <Link href={href} className={`flex-1 text-center py-3 text-sm ${pathname===href?'text-foreground font-semibold':'text-muted-foreground'}`}>{label}</Link>
  )
  return <nav className="border-t border-border bg-background sticky bottom-0">{item('/','Home')}{item('/history','History')}</nav>
}
