const server = require( 'zemez-express' );

server({
	pug: { root: 'dev' },
	sass: { root: 'dev' }
});
