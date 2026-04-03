import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-background/60 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-5">
        {/* Logos */}
        <div className="flex items-center gap-8">
          <Image
            src="/images/logo-cenfotc-Horizontal-Negro.png"
            alt="Universidad CENFOTEC"
            width={140}
            height={35}
            className="h-7 w-auto object-contain opacity-60 dark:invert"
          />
          <div className="h-8 w-px bg-border" />
          <Image
            src="/images/logo-Software-Engineering-Negro.png"
            alt="Escuela de Ingeniería del Software — ESOFT"
            width={160}
            height={40}
            className="h-8 w-auto object-contain opacity-60 dark:invert"
          />
        </div>

        {/* Attribution */}
        <p className="text-center text-xs text-muted-foreground/60">
          Desarrollado por la Escuela de Ingeniería del Software — ESOFT
        </p>
      </div>
    </footer>
  );
}
