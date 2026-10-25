// Next

import { BookOpen, MessageSquareText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
// Zod
import { z } from "zod";
// Infraestructura
import { createPublicClient } from "@/adapters/outbound/supabase/public";
import { SupabaseSnippetRepository } from "@/adapters/outbound/supabase/snippet-repository";
// Componentes
import { Badge } from "@/components/ui/Badge";
// Aplicación
import { obtenerSnippetPublico } from "@/core/application/obtener-snippet-publico";

// Una sola lectura por request (metadata + página)
const cargarSnippet = cache(async (token: string) => {
	const repo = new SupabaseSnippetRepository(createPublicClient());
	return obtenerSnippetPublico(token, repo).catch(() => null);
});

// La página depende del token y de la base de datos
export const instant = false;

// Formatea la fecha sin depender de la zona del usuario
function formatearFecha(iso: string): string {
	return new Intl.DateTimeFormat("es", { dateStyle: "long" }).format(
		new Date(iso),
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ token: string }>;
}): Promise<Metadata> {
	const { token } = await params;
	const snippet = await cargarSnippet(token);

	if (!snippet) {
		return {
			title: "Snippet no encontrado · codebook",
			robots: { index: false, follow: false },
		};
	}

	return {
		title: "Snippet · codebook",
		description: snippet.explanation,
		robots: { index: false, follow: false },
		openGraph: {
			title: "Snippet · codebook",
			description: snippet.explanation,
			type: "article",
		},
		twitter: { card: "summary_large_image" },
	};
}

export default async function SnippetPublicoPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;

	if (!z.uuid().safeParse(token).success) notFound();

	const snippet = await cargarSnippet(token);

	if (!snippet) notFound();

	return (
		<main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6">
			<header className="mb-8 flex items-center justify-between">
				<Link
					href="/"
					className="inline-flex items-center gap-2.5 font-semibold tracking-tight"
				>
					<span className="grid size-8 place-items-center rounded-lg bg-accent text-white">
						<BookOpen size={16} aria-hidden />
					</span>
					codebook
				</Link>

				{snippet.language && <Badge>{snippet.language}</Badge>}
			</header>

			<pre className="overflow-x-auto rounded-xl border border-border bg-surface-2 p-5 text-sm leading-relaxed">
				<code>{snippet.code}</code>
			</pre>

			<p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted">
				<MessageSquareText size={15} aria-hidden className="mt-0.5 shrink-0" />
				<span>{snippet.explanation}</span>
			</p>

			<div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted">
				<span>{formatearFecha(snippet.createdAt)}</span>
				<Link href="/" className="text-accent-text hover:underline">
					Crea tu colección en codebook →
				</Link>
			</div>
		</main>
	);
}
