document.addEventListener( 'DOMContentLoaded', function () {
	document.querySelectorAll( '.parallax' ).forEach( function ( parallaxNode ) {
		new Parallax({ node: parallaxNode });
	});
});
