// Next

import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
// Locales
import { ruta } from "@/i18n/rutas";
import * as m from "@/paraglide/messages";
import { isLocale } from "@/paraglide/runtime";

// Título y descripción según el idioma de la ruta
export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const activo = isLocale(locale) ? locale : "es";

	return {
		title: m.meta_home_title({}, { locale: activo }),
		description: m.meta_home_description({}, { locale: activo }),
	};
}

const ctaPrimario =
	"inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover";

export default async function LandingPage({ params }: PageProps<"/[locale]">) {
	const { locale: idioma } = await params;
	const locale = isLocale(idioma) ? idioma : "es";

	// Pasos del flujo, como píldoras bajo el titular
	const pasos = [
		{ numero: "01", texto: m.home_step_1({}, { locale }) },
		{ numero: "02", texto: m.home_step_2({}, { locale }) },
		{ numero: "03", texto: m.home_step_3({}, { locale }) },
	];

	return (
		<>
			<main className="flex min-h-svh flex-col">
				<section className="relative flex min-h-svh items-center overflow-hidden pt-[var(--header-h)]">
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_65%)]"
					/>

					<div className="relative mx-auto grid w-full max-w-5xl gap-5 px-4 text-center sm:px-6">
						<p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-text">
							{m.home_eyebrow({}, { locale })}
						</p>

						<h1 className="mx-auto max-w-[54rem] text-[clamp(2.4rem,7vw,4.8rem)] font-bold leading-[0.95] tracking-[-0.055em]">
							{m.home_title_lead({}, { locale })}{" "}
							<span className="text-accent-text">
								{m.home_title_accent({}, { locale })}
							</span>
							.
						</h1>

						<p className="mx-auto max-w-[42rem] text-[1.02rem] leading-[1.7] text-muted">
							{m.home_subtitle({}, { locale })}
						</p>

						<ol className="mt-2 flex flex-wrap justify-center gap-2">
							{pasos.map((paso) => (
								<li
									key={paso.numero}
									className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-[0.74rem] text-muted"
								>
									<span className="font-mono text-[0.62rem] text-accent-text">
										{paso.numero}
									</span>
									{paso.texto}
								</li>
							))}
						</ol>

						<div className="mt-4 flex flex-wrap items-center justify-center gap-3">
							<Link href={ruta(locale, "/generator")} className={ctaPrimario}>
								{m.home_cta({}, { locale })}
								<ArrowRight size={16} aria-hidden />
							</Link>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
