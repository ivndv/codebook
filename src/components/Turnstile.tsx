"use client";

// Next
import Script from "next/script";
// React
import { useEffect, useRef, useState } from "react";

// Tipos mínimos del API de Turnstile
interface TurnstileApi {
	render: (
		contenedor: HTMLElement,
		opciones: {
			sitekey: string;
			theme?: "light" | "dark" | "auto";
			size?: "normal" | "compact" | "flexible";
			callback?: (token: string) => void;
			"expired-callback"?: () => void;
			"error-callback"?: () => void;
		},
	) => string;
	reset: (id?: string) => void;
	remove: (id?: string) => void;
}

declare global {
	interface Window {
		turnstile?: TurnstileApi;
	}
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Widget de Cloudflare Turnstile: entrega el token al formulario
export function Turnstile({
	onToken,
	resetSignal = 0,
}: {
	onToken: (token: string) => void;
	resetSignal?: number;
}) {
	const contenedorRef = useRef<HTMLDivElement>(null);
	const widgetRef = useRef<string | null>(null);
	const [cargado, setCargado] = useState(false);

	// Si el script ya estaba cargado (navegación interna), lo detectamos
	useEffect(() => {
		if (window.turnstile) setCargado(true);
	}, []);

	// 1. Renderiza el widget cuando el script está listo
	useEffect(() => {
		if (!cargado || !contenedorRef.current || !window.turnstile || !SITE_KEY) {
			return;
		}

		widgetRef.current = window.turnstile.render(contenedorRef.current, {
			sitekey: SITE_KEY,
			theme: "dark",
			size: "flexible",
			callback: onToken,
			"expired-callback": () => onToken(""),
			"error-callback": () => onToken(""),
		});

		return () => {
			if (widgetRef.current) {
				window.turnstile?.remove(widgetRef.current);
				widgetRef.current = null;
			}
		};
	}, [cargado, onToken]);

	// 2. Reinicia el desafío tras un intento fallido
	useEffect(() => {
		if (resetSignal > 0 && widgetRef.current) {
			window.turnstile?.reset(widgetRef.current);
			onToken("");
		}
	}, [resetSignal, onToken]);

	if (!SITE_KEY) {
		return (
			<p className="text-xs text-red-300">
				Falta configurar NEXT_PUBLIC_TURNSTILE_SITE_KEY.
			</p>
		);
	}

	return (
		<>
			<Script
				src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
				strategy="afterInteractive"
				onLoad={() => setCargado(true)}
			/>
			<div ref={contenedorRef} className="w-full min-h-[65px]" />
		</>
	);
}
