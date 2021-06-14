const d = document;
export const showAlert = (element, msj) => {
	const $templateAlert = d.getElementById("templateAlert").content;
	$templateAlert.getElementById("alert").textContent = msj;
	const $clone = $templateAlert.cloneNode(true);

	if (!element.firstChild) {
		element.appendChild($clone);
	}
};
