// Next
import { ImageResponse } from "next/og";
// Zod
import { z } from "zod";
// Infraestructura
import { createPublicClient } from "@/adapters/outbound/supabase/public";
import { SupabaseSnippetRepository } from "@/adapters/outbound/supabase/snippet-repository";
// Aplicación
import { obtenerSnippetPublico } from "@/core/application/obtener-snippet-publico";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Snippet de codebook";

// Recorta el código a las primeras líneas
function recortarCodigo(code: string): string {
	const lineas = code.split("\n");
	const visibles = lineas.slice(0, 10);
	const texto = visibles.join("\n");
	return lineas.length > 10 ? `${texto}\n…` : texto;
}

export default async function Image({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;

	const snippet = z.uuid().safeParse(token).success
		? await obtenerSnippetPublico(
				token,
				new SupabaseSnippetRepository(createPublicClient()),
			).catch(() => null)
		: null;

	const codigo = recortarCodigo(snippet?.code ?? "Snippet no disponible");
	const explicacion = (snippet?.explanation ?? "").slice(0, 180);
	const lenguaje = snippet?.language ?? "snippet";

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				background: "#0f0e12",
				color: "#f0edf5",
				padding: 64,
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 16,
						fontSize: 30,
						fontWeight: 700,
					}}
				>
					<div
						style={{
							width: 48,
							height: 48,
							borderRadius: 14,
							background: "#7c5cff",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 20,
						}}
					>
						{"</>"}
					</div>
					codebook
				</div>

				<div
					style={{
						display: "flex",
						border: "1px solid #2b2735",
						borderRadius: 999,
						padding: "8px 20px",
						fontSize: 20,
						color: "#b3a3ff",
					}}
				>
					{lenguaje}
				</div>
			</div>

			<div
				style={{
					display: "flex",
					marginTop: 40,
					flex: 1,
					background: "#1f1c27",
					border: "1px solid #2b2735",
					borderRadius: 20,
					padding: 32,
					fontSize: 22,
					lineHeight: 1.5,
					whiteSpace: "pre-wrap",
					overflow: "hidden",
				}}
			>
				{codigo}
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginTop: 28,
					fontSize: 20,
					color: "#a49fb2",
				}}
			>
				<div style={{ display: "flex", maxWidth: 900 }}>{explicacion}</div>
				<div style={{ display: "flex" }}>codebook</div>
			</div>
		</div>,
		{ ...size },
	);
}
