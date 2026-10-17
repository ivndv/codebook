"use server";

// Next
import { revalidatePath } from "next/cache";
// Tipos
import type { AnalisisState } from "@/lib/analisis";
// Datos
import { MAX_CODE_LENGTH, summarize } from "@/lib/summarize";
// Supabase
import { createClient } from "@/lib/supabase/server";

// Estado inicial vacío del formulario
const VACIO: AnalisisState = {
	error: null,
	explanation: null,
	language: null,
	guardado: false,
};

// Analiza el fragmento y, si hay sesión, lo guarda en Postgres (el invitado no guarda)
export async function analizarYGuardar(
	_previo: AnalisisState,
	formData: FormData,
): Promise<AnalisisState> {
	const code = String(formData.get("code") ?? "").trim();

	// 1. Valida el código
	if (!code) {
		return { ...VACIO, error: "El código está vacío." };
	}
	if (code.length > MAX_CODE_LENGTH) {
		return {
			...VACIO,
			error: `El código supera los ${MAX_CODE_LENGTH.toLocaleString("es")} caracteres.`,
		};
	}

	// 2. Pide el resumen a la IA (mock hasta la F8)
	let resumen: Awaited<ReturnType<typeof summarize>>;
	try {
		resumen = await summarize(code);
	} catch (err) {
		return {
			...VACIO,
			error:
				err instanceof Error ? err.message : "Ocurrió un error inesperado.",
		};
	}

	const supabase = await createClient();
	const { data: sesion } = await supabase.auth.getClaims();

	// 3. Sin sesión solo se muestra la explicación, no se guarda nada
	if (!sesion?.claims) {
		return {
			error: null,
			explanation: resumen.explanation,
			language: resumen.language,
			guardado: false,
		};
	}

	// 4. Inserta en Postgres (user_id lo pone la DB con auth.uid(); RLS lo valida)
	const { error } = await supabase.from("snippets").insert({
		code,
		explanation: resumen.explanation,
		language: resumen.language,
	});

	if (error) {
		return {
			error: `No se pudo guardar: ${error.message}`,
			explanation: resumen.explanation,
			language: resumen.language,
			guardado: false,
		};
	}

	// 5. Refresca la lista (Server Component) con el snippet nuevo dentro
	revalidatePath("/");

	return {
		error: null,
		explanation: resumen.explanation,
		language: resumen.language,
		guardado: true,
	};
}

// Borra un snippet del usuario. RLS impide borrar los de otro
export async function borrarSnippet(
	id: string,
): Promise<{ error: string | null }> {
	const supabase = await createClient();
	const { error } = await supabase.from("snippets").delete().eq("id", id);

	if (error) return { error: error.message };

	revalidatePath("/");
	return { error: null };
}
