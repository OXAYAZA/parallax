const
	{ action, task, util } = require( 'zemez-build' ),
	gulp   = require( 'gulp' ),
	babel  = require( 'gulp-babel' ),
	rename = require( 'gulp-rename' ),
	color  = require( 'ansi-colors' );

/**
 * Минификация js файлов
 * @param {object} data - обьект с параметрами
 * @param {string} [data.name] - отображаемое имя действия
 * @param {function} [data.cb] - выполняемый колбек (должен быть синхронным)
 * @param {object} [data.opts] - gulp.src параметры
 * @param {string|Array} data.src - glob выборка файлов для компиляции
 * @param {string} data.dest - путь назначения
 */
action.minifyJs = function ( data ) {
	if ( !data || !data.src || !data.dest ) throw Error( 'Required parameter of action.minifyJs not specified (src, dest)' );

	data.execute = function () {
		if ( data.cb instanceof Function ) data.cb();
		util.log( 'Minify JS:', color.magenta( data.src ), '>>', color.magenta( data.dest ) );
		return gulp.src( data.src, data.opts )
			.pipe( babel( { presets: [ '@babel/env' ], comments: false, compact: true, minified: true, sourceType: 'script' } ) )
			.pipe( rename({ suffix: '.min' }) )
			.pipe( gulp.dest( data.dest ) );
	};

	data.execute.displayName = data.name || 'Minify Js';
	return data;
};

module.exports.default = task([
	action.clean({ src: 'dist' }),
	action.copy({ src: 'dev/parallax.scss', dest: 'dist' }),
	action.sass({ src: 'dev/parallax.scss', dest: 'dist', sass: { outputStyle: 'compressed' } }),
	action.minifyJs({ src: 'dev/parallax.js', dest: 'dist' }),
	action.custom({ cb: () => {
		const
			fs = require( 'fs' ),
			path = require( 'path' ),
			glob = require( 'glob' );

		let paths = glob.sync( `dev/parallax.js` );
		paths.forEach( function( item ) {
			let
				fname   = `dist/`+ path.basename( item, '.js' ) +`.min.js`,
				comment = fs.readFileSync( item, 'utf8' ).match( /\/\*\*(.|\s)*?\*\// )[0],
				content = fs.readFileSync(  fname, 'utf8' );

			fs.writeFileSync( fname, comment +'\n'+ content.replace( /(['"])use strict\1;/, '' ) );
		});
	}})
]);
