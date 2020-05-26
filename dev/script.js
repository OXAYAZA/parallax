/**
 * Определение тэга получаемого обьекта (для точного определения типа)
 * @param {*} data - любой обьект
 * @returns {string} - тэг обьекта
 */
function objectTag ( data ) {
	return Object.prototype.toString.call( data ).slice( 8, -1 );
}

/**
 * Слияние объектов
 * @param {Object} source - исходный объект
 * @param {Object} merged - слияемый объект
 * @return {Object} - измененный исходный объект
 */
function merge( source, merged ) {
	for ( let key in merged ) {
		if ( objectTag( merged[ key ] ) === 'Object' ) {
			if ( typeof( source[ key ] ) !== 'object' ) source[ key ] = {};
			source[ key ] = merge( source[ key ], merged[ key ] );
		} else {
			source[ key ] = merged[ key ];
		}
	}

	return source;
}

/**
 * Wrapper to eliminate json errors
 * @param {string} str - JSON string
 * @returns {object} - parsed or empty object
 */
function parseJSON ( str ) {
	try {
		if ( str )  return JSON.parse( str );
		else return {};
	} catch ( error ) {
		console.warn( error );
		return {};
	}
}


document.addEventListener( 'DOMContentLoaded', function () {
	document.querySelectorAll( '.parallax' ).forEach( function ( parallaxNode ) {
		new Parallax({
			node: parallaxNode
		});
	});
});
