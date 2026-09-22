import defaultLogo from "@razzia/web/assets/logo.svg";
import { getBranding, imageFallback } from "@razzia/web/branding";
import GithubIcon from "@razzia/web/components/layout/GithubIcon";
import type { PropsWithChildren } from "react";

const Background = ({ children }: PropsWithChildren) => {
  const branding = getBranding();
  const logo = branding?.logo ?? defaultLogo;
  const appName = branding?.appName ?? "Andhivie";

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center">
      {/* Pola latar — sama dengan GameBackground, konsisten di seluruh app */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/15 absolute top-[-70vmin] left-[-50vmin] min-h-[120vmin] min-w-[120vmin] rotate-20 rounded-4xl" />
        <div className="bg-primary/15 absolute right-[-10vmin] bottom-[-45vmin] min-h-[75vmin] min-w-[75vmin] rotate-20 rounded-4xl" />
      </div>

      <img
        src={logo}
        onError={imageFallback(defaultLogo)}
        className="-mb-2 h-auto w-auto max-h-44 max-w-[min(90vw,560px)] object-contain"
        alt={appName}
      />
      {children}

      <a
        href="https://github.com/Ralex91/Razzia"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-sm font-semibold text-white/50 transition-colors hover:text-white/80"
      >
        <GithubIcon size={14} />
        {/* oxlint-disable-next-line no-undef */}
        Andhivie - v{__APP_VERSION__}
      </a>
    </section>
  );
};

export default Background;