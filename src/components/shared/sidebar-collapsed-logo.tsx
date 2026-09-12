import Image from 'next/image';

export function SidebarCollapsedLogo() {
  return (
    <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-2 transition-all duration-300">
      <div className="size-8 rounded-full overflow-hidden ring-2 ring-primary shrink-0">
        <Image
          src="/person.jpeg"
          alt="logo"
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
