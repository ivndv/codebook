import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	cacheComponents: true,
	partialPrefetching: true,
	// Permite abrir el dev server también por 127.0.0.1 (evita el aviso cross-origin)
	allowedDevOrigins: ["127.0.0.1"],
	// Las rutas antiguas en español se conservan como redirecciones permanentes
	async redirects() {
		return [
			{
				source: "/generador",
				destination: "/es/generator",
				permanent: true,
			},
			{
				source: "/registro",
				destination: "/es/register",
				permanent: true,
			},
			{
				source: "/recuperar",
				destination: "/es/forgot-password",
				permanent: true,
			},
			{
				source: "/restablecer",
				destination: "/es/reset-password",
				permanent: true,
			},
		];
	},
	turbopack: {
		rules: {
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
};

export default nextConfig;
