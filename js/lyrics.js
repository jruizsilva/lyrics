import { showAlert } from "./UI/alerta.js";

const d = document;

const $formulario = d.getElementById("formulario");
const $result = d.getElementById("result");

const showLyrics = (lyrics, artist, song) => {
	const $templateLyrics = d.getElementById("templateLyrics").content;
	$templateLyrics.getElementById("lyrics__letter").innerText = lyrics;
	$templateLyrics.getElementById("lyrics__author").textContent = artist;
	$templateLyrics.getElementById("lyrics__song").textContent = song;

	const $clone = $templateLyrics.cloneNode(true);
	$result.appendChild($clone);
};
const limpiarHTML = () => {
	while ($result.firstChild) {
		$result.removeChild($result.firstChild);
	}
};

const consultarAPI = (e) => {
	e.preventDefault();
	const artista = $formulario.artista.value;
	const cancion = $formulario.cancion.value;

	const url = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${cancion}&q_artist=${artista}&apikey=3b75f22ef8940d19c4f29219e743a6c6`;

	const encodeURL = encodeURIComponent(url);

	const allowOrigenURL = `https://api.allorigins.win/get?url=${encodeURL}`;

	fetch(allowOrigenURL)
		.then((res) => res.json())
		.then((string) => JSON.parse(string.contents))
		.then((datos) => {
			limpiarHTML();
			// Primero comprobamos si existe una coincidencia
			const { status_code } = datos.message.header;
			if (status_code >= 400 && status_code < 500) {
				return Promise.reject(`Error ${status_code}: not found`);
			}
			// Comprobamos que se pueda mostrar la letra
			const regexCopyright = new RegExp("Unfortunately", "gi");
			const { lyrics_copyright } = datos.message.body.lyrics;
			if (regexCopyright.test(lyrics_copyright)) {
				return Promise.reject(lyrics_copyright);
			}
			// mostramos la letra
			const { lyrics_body } = datos.message.body.lyrics;
			showLyrics(lyrics_body, artista, cancion);
		})
		.catch((err) => {
			limpiarHTML();
			showAlert($result, err);
		});
};

$formulario.addEventListener("submit", consultarAPI);
