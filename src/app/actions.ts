"use server";

// Next
import { revalidatePath } from "next/cache";
// Tipos
import type { AnalisisState } from "@/lib/analisis";
// Datos
import { analizarConIA, MAX_CODE_LENGTH, type Summary } from "@/lib/summarize";
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

	// 2. Pide el resumen a la IA real (codebook-api → Groq)
	let resumen: Summary;
	try {
		resumen = await analizarConIA(code);
	} catch (err) {
		// El detalle va a los logs; al usuario le damos un mensaje claro
		console.error("[analizarYGuardar]", err);
		return {
			...VACIO,
			error: "No se pudo obtener la explicación. Inténtalo de nuevo.",
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
