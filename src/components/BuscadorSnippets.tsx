"use client";

// Iconos
import { LoaderCircle, Search, X } from "lucide-react";
// Next
import { usePathname, useRouter } from "next/navigation";
// React
import { useCallback, useEffect, useState, useTransition } from "react";
// Tipos
import type { FiltrosSnippets } from "@/core/domain/filtros-snippets";
// Locales
import { useLocale } from "@/i18n/LocaleProvider";
import * as m from "@/paraglide/messages";

// Espera antes de buscar mientras se escribe
const RETARDO_MS = 350;

const claseControl =
	"h-9 rounded-lg border border-border bg-surface-2 px-3 text-xs text-text outline-none transition-colors focus:border-accent";

// Buscador con debounce: el estado vive en la URL
export function BuscadorSnippets({
	filtros,
	lenguajes,
}: {
	filtros: FiltrosSnippets;
	lenguajes: string[];
}) {
	const locale = useLocale();

	// Estado
	const router = useRouter();
	const pathname = usePathname();
	const [pendiente, startTransition] = useTransition();
	const [busqueda, setBusqueda] = useState(filtros.busqueda);

	// Mantiene el input alineado con la URL
	useEffect(() => {
		setBusqueda(filtros.busqueda);
	}, [filtros.busqueda]);

	const navegar = useCallback(
		(cambios: {
			q?: string;
			lenguaje?: string | null;
			orden?: string;
			alcance?: string;
			fecha?: string;
		}) => {
			const q = cambios.q !== undefined ? cambios.q.trim() : filtros.busqueda;
			const lenguaje =
				cambios.lenguaje !== undefined ? cambios.lenguaje : filtros.lenguaje;
			const orden = cambios.orden !== undefined ? cambios.orden : filtros.orden;
			const alcance =
				cambios.alcance !== undefined ? cambios.alcance : filtros.alcance;
			const fecha = cambios.fecha !== undefined ? cambios.fecha : filtros.fecha;

			const params = new URLSearchParams();

			if (q) params.set("q", q);
			if (lenguaje) params.set("lenguaje", lenguaje);
			if (orden !== "recientes") params.set("orden", orden);
			if (alcance !== "todo") params.set("en", alcance);
			if (fecha !== "todo") params.set("fecha", fecha);

			const query = params.toString();

			startTransition(() => {
				router.replace(query ? `${pathname}?${query}` : pathname, {
					scroll: false,
				});
			});
		},
		[filtros, pathname, router],
	);

	// Debounce del texto
	useEffect(() => {
		if (busqueda === filtros.busqueda) return;

		const id = setTimeout(() => navegar({ q: busqueda }), RETARDO_MS);

		return () => clearTimeout(id);
	}, [busqueda, filtros.busqueda, navegar]);

	const hayFiltros =
		filtros.busqueda !== "" ||
		filtros.lenguaje !== null ||
		filtros.orden !== "recientes" ||
		filtros.alcance !== "todo" ||
		filtros.fecha !== "todo";

	return (
		<div className="flex flex-wrap items-center gap-2">
			<div className="relative min-w-[12rem] flex-1">
				<Search
					size={14}
					aria-hidden
					className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
				/>
				<input
					type="search"
					value={busqueda}
					onChange={(evento) => setBusqueda(evento.target.value)}
					placeholder={m.snippet_search_placeholder({}, { locale })}
					aria-label={m.snippet_search_aria({}, { locale })}
					className="h-9 w-full rounded-lg border border-border bg-surface-2 pl-9 pr-3 text-sm text-text outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
				/>
				{pendiente && (
					<LoaderCircle
						size={14}
						aria-hidden
						className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted"
					/>
				)}
			</div>

			<select
				value={filtros.alcance}
				onChange={(evento) => navegar({ alcance: evento.target.value })}
				disabled={!busqueda.trim()}
				aria-label={m.snippet_scope_aria({}, { locale })}
				className={`${claseControl} disabled:cursor-not-allowed disabled:opacity-50`}
			>
				<option value="todo">{m.snippet_scope_all({}, { locale })}</option>
				<option value="codigo">{m.snippet_scope_code({}, { locale })}</option>
				<option value="explicacion">
					{m.snippet_scope_explanation({}, { locale })}
				</option>
			</select>

			<select
				value={filtros.lenguaje ?? ""}
				onChange={(evento) =>
					navegar({ lenguaje: evento.target.value || null })
				}
				aria-label={m.snippet_language_filter_aria({}, { locale })}
				className={claseControl}
			>
				<option value="">{m.snippet_language_all({}, { locale })}</option>
				{lenguajes.map((lenguaje) => (
					<option key={lenguaje} value={lenguaje}>
						{lenguaje}
					</option>
				))}
			</select>

			<select
				value={filtros.fecha}
				onChange={(evento) => navegar({ fecha: evento.target.value })}
				aria-label={m.snippet_date_filter_aria({}, { locale })}
				className={claseControl}
			>
				<option value="todo">{m.snippet_date_any({}, { locale })}</option>
				<option value="hoy">{m.snippet_date_today({}, { locale })}</option>
				<option value="7d">{m.snippet_date_7d({}, { locale })}</option>
				<option value="30d">{m.snippet_date_30d({}, { locale })}</option>
			</select>

			<select
				value={filtros.orden}
				onChange={(evento) => navegar({ orden: evento.target.value })}
				aria-label={m.snippet_sort_aria({}, { locale })}
				className={claseControl}
			>
				<option value="recientes">
					{m.snippet_sort_recent({}, { locale })}
				</option>
				<option value="antiguos">
					{m.snippet_sort_oldest({}, { locale })}
				</option>
			</select>

			{hayFiltros && (
				<button
					type="button"
					onClick={() =>
						navegar({
							q: "",
							lenguaje: null,
							orden: "recientes",
							alcance: "todo",
							fecha: "todo",
						})
					}
					className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs text-muted transition-colors hover:bg-accent-soft hover:text-text"
				>
					<X size={14} aria-hidden />
					{m.common_clear({}, { locale })}
				</button>
			)}
		</div>
	);
}
