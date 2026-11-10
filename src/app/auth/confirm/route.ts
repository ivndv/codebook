// Supabase
import type { EmailOtpType } from "@supabase/supabase-js";
// Next
import { type NextRequest, NextResponse } from "next/server";
// Infraestructura
import { createClient } from "@/adapters/outbound/supabase/client/server";

// Límite local por IP: el canje de tokens no debe permitir ráfagas
const VENTANA_MS = 60_000;
const MAXIMO = 30;
const intentos = new Map<string, number[]>();

// Marca un intento y dice si ya se superó el máximo de la ventana
function superaLimite(ip: string): boolean {
	const ahora = Date.now();
	const previos = (intentos.get(ip) ?? []).filter(
		(marca) => ahora - marca < VENTANA_MS,
	);

	if (previos.length >= MAXIMO) {
		intentos.set(ip, previos);
		return true;
	}

	previos.push(ahora);
	intentos.set(ip, previos);

	return false;
}

// IP real que añade el proxy del hosting
function ipDe(request: NextRequest): string {
	const reenviado = request.headers.get("x-forwarded-for") ?? "";
	const primera = reenviado.split(",")[0]?.trim();

	return primera || request.headers.get("x-real-ip") || "desconocida";
}

// Confirma enlaces de email (verificación o recuperación) y deja la sesión en cookies
export async function GET(request: NextRequest) {
	if (superaLimite(ipDe(request))) {
		return NextResponse.json(
			{ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
			{ status: 429 },
		);
	}

	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const tokenHash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;
	const pedido = searchParams.get("next") ?? "/generator";
	const next =
		pedido.startsWith("/") && !pedido.startsWith("//") ? pedido : "/generator";

	const supabase = await createClient();

	// 1. Flujo PKCE: canje del código por sesión
	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) return NextResponse.redirect(`${origin}${next}`);
	}

	// 2. Enlaces con token_hash (verificación o recuperación)
	if (tokenHash && type) {
		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash: tokenHash,
		});

		if (!error) return NextResponse.redirect(`${origin}${next}`);
	}

	return NextResponse.redirect(`${origin}/login?error=auth`);
}
