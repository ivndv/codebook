// Infraestructura
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import php from "highlight.js/lib/languages/php";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

// Lenguajes que registramos en el núcleo de highlight.js
const LENGUAJES = {
	bash,
	c,
	cpp,
	csharp,
	css,
	go,
	java,
	javascript,
	json,
	markdown,
	php,
	plaintext,
	python,
	ruby,
	rust,
	sql,
	typescript,
	xml,
	yaml,
};

// Alias que suele devolver la IA → nombre registrado
const ALIAS: Record<string, string> = {
	py: "python",
	h: "c",
	js: "javascript",
	jsx: "javascript",
	ts: "typescript",
	tsx: "typescript",
	sh: "bash",
	shell: "bash",
	zsh: "bash",
	html: "xml",
	svg: "xml",
	yml: "yaml",
	md: "markdown",
	cs: "csharp",
	"c++": "cpp",
	"c#": "csharp",
};

// Registro único por proceso
for (const [nombre, lenguaje] of Object.entries(LENGUAJES)) {
	hljs.registerLanguage(nombre, lenguaje);
}

// Devuelve el HTML resaltado; si el lenguaje no se conoce, usa texto plano
export function resaltarCodigo(
	codigo: string,
	lenguaje: string | null,
): string {
	const pedido = (lenguaje ?? "").toLowerCase().trim();
	const nombre = ALIAS[pedido] ?? pedido;
	const seguro = hljs.getLanguage(nombre) ? nombre : "plaintext";

	return hljs.highlight(codigo, { language: seguro, ignoreIllegals: true })
		.value;
}
