const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="icd-styles">
	<template>
		<style is="custom-style">
			.ICD-10--IV{ color: var(--paper-red-a200) !important;}
			.ICD-10--IV span, .ICD-10--IV-bg::after::after{ background: var(--paper-red-a200) !important;}

			.ICD-10--V{ color: var(--paper-pink-a200) !important;}
			.ICD-10--V span, .ICD-10--V-bg::after{ background: var(--paper-pink-a200) !important; }

			.ICD-10--VI { color: var(--paper-purple-a200) !important;}
			.ICD-10--VI span, .ICD-10--VI-bg::after{ background: var(--paper-purple-a200) !important; }

			.ICD-10--VII{ color: var(--paper-deep-purple-a200) !important;}
			.ICD-10--VII span, .ICD-10--VII-bg::after{ background: var(--paper-deep-purple-a200) !important; }

			.ICD-10--VIII{ color: var(--paper-indigo-a200) !important;}
			.ICD-10--VIII span, .ICD-10--VIII-bg::after{ background: var(--paper-indigo-a200) !important; }

			.ICD-10--IX{ color: var(--paper-blue-a200) !important;}
			.ICD-10--IX span, .ICD-10--IX-bg::after{ background: var(--paper-blue-a200) !important; }

			.ICD-10--X{ color: var(--paper-light-blue-a200) !important;}
			.ICD-10--X span, .ICD-10--X-bg::after{ background: var(--paper-light-blue-a200) !important; }

			.ICD-10--XI{ color: var(--paper-cyan-a700) !important;}
			.ICD-10--XI span, .ICD-10--XI-bg::after{ background: var(--paper-cyan-a700) !important; }

			.ICD-10--XII{ color: var(--paper-teal-a400) !important;}
			.ICD-10--XII span, .ICD-10--XII-bg::after{ background: var(--paper-teal-a400) !important; }

			.ICD-10--XIII{ color: var(--paper-green-a400) !important;}
			.ICD-10--XIII span, .ICD-10--XIII-bg::after{ background: var(--paper-green-a400) !important; }

			.ICD-10--XIV{ color: var(--paper-light-green-a400) !important;}
			.ICD-10--XIV span, .ICD-10--XIV-bg::after{ background: var(--paper-light-green-a400) !important; }

			.ICD-10--XV{ color: var(--paper-amber-a400) !important;}
			.ICD-10--XV span, .ICD-10--XV-bg::after{ background: var(--paper-amber-a400) !important; }

			.ICD-10--XVI{ color: var(--paper-orange-a400) !important;}
			.ICD-10--XVI span, .ICD-10--XVI-bg::after{ background: var(--paper-orange-a400) !important; }

			.ICD-10--XVII{ color: var(--paper-deep-orange-a200) !important;}
			.ICD-10--XVII span, .ICD-10--XVII-bg::after{ background: var(--paper-deep-orange-a200) !important; }

			.ICD-10--other{ color: var(--paper-brown-500) !important;}
			.ICD-10--other span, .ICD-10--other-bg::after{ background: var(--paper-brown-500) !important; }
		</style>
	</template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

/* shared styles for all elements and index.html */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
;
