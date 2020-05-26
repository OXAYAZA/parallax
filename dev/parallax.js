( function () {
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
	 * Вертикальный паралакс.
	 * @param {object} params - параметры паралакса.
	 * @param {Element} params.node - элемент DOM из которого будет сделан паралакс.
	 * @param {string} [params.layerSelector] - селектор элементов из которых будут сделанны слои паралакса.
	 * @param {string} [params.layerParams] - атрибут с параметрами для каждого слоя, должен содержать JSON.
	 * @constructor
	 */
	function Parallax ( params ) {
		// Проверка обязательных параметров
		if ( !params.node || !( params.node instanceof Element ) ) {
			throw new Error( 'Parallax node must be an Element' );
		}

		// Слияние параметров экземпляра с параметрами по умолчанию
		merge( this, {
			layerSelector: '.parallax-layer',
			layerParams: 'data-parallax-layer'
		});

		// Слияние параметров экземпляра с полученными параметрами
		merge( this, params );

		if ( typeof( this.layerSelector ) === 'string' ) {
			// Получение элементов для слоев
			this.layers = this.node.querySelectorAll( this.layerSelector );

			// Создание слоев
			this.layers.forEach( ( node ) => {
				new ParallaxLayer( merge( parseJSON( node.getAttribute( this.layerParams ) ), {
					node: node,
					owner: this
				}));
			});
		}

		// Добавление ссылки на экземпляр в параметры элемента
		this.node.parallax = this;
	}

	// Изменение тэга Parallax
	Object.defineProperty( Parallax.prototype, Symbol.toStringTag, {
		get: function () { return 'Parallax'; }
	});


	/**
	 * Слой паралакса.
	 * @param {object} params - параметры слоя.
	 * @param {Element} params.node - элемент из которого будет сделан слой паралакса.
	 * @param {Parallax} params.owner - экземпляр паралакса к которому относится слой.
	 * @param {number} [params.coeff] - коеффициент скорости движенеия слоя по мере скрола страницы.
	 * @param {boolean} [params.autosize] - автоматический подгон высоты слоя дла полного перекрытия родительского элемента при скроле страницы.
	 * @param {Function} [params.onReady] - функция обратного вызова выполняющаяся при готовности слоя.
	 * @param {Function} [params.heightHandler] - функция для обработки значения высоты при подгоне размеров слоя, не вызывается если `autosize: false`.
	 * @param {Function} [params.offsetHandler] - функция для обработки значения смещения слоя при скролле.
	 * @constructor
	 */
	function ParallaxLayer ( params ) {
		// Проверка обязательных параметров
		if ( !params.node || !( params.node instanceof Element ) ) {
			throw new Error( 'Layer node must be an instance of Element' );
		}

		if ( !params.owner || !( params.owner instanceof Parallax ) ) {
			throw new Error( 'Layer owner must be an instance of Parallax' );
		}

		// Слияние параметров экземпляра с параметрами по умолчанию
		merge( this, {
			coeff: 0.1,
			onReady: null,
			autosize: true,
			heightHandler: ( node, height ) => {
				node.style.height = height +'px';
			},
			offsetHandler: ( node, offset ) => {
				node.style.transform = 'translate3d( 0, calc( -50% + '+ offset +'px ), 0 )';
			}
		});

		// Слияние параметров экземпляра с полученными параметрами
		merge( this, params );

		// Получение дополнительных параметров
		this.wh = window.innerHeight;
		this.rect = this.owner.node.getBoundingClientRect();

		// Установка высоты и смещения слоя
		this.setHeight();
		this.setOffset();

		// Установка обработчиков ресайза и скролла
		window.addEventListener( 'resize', this.resize.bind( this ) );
		document.addEventListener( 'scroll', this.scroll.bind( this ) );

		// Добавление ссылки на экземпляр в параметры элемента
		this.node.parallaxLayer = this;

		// Колбек готовности
		if ( this.onReady instanceof Function ) {
			this.onReady.call( this );
		}
	}

	/**
	 * Метод установки высоты слоя.
	 */
	ParallaxLayer.prototype.setHeight = function() {
		if ( this.autosize ) {
			if( this.coeff >= 0 ) {
				this.height = ~~( this.rect.height + ( this.wh + this.rect.height ) * this.coeff );
			} else if( this.coeff < 0 && this.coeff >= -1 ) {
				this.height = ~~( this.rect.height + ( this.wh - this.rect.height ) * Math.abs( this.coeff ) );
			} else if( this.coeff < -1 ) {
				this.height = ~~( ( this.wh + this.rect.height ) * Math.abs( this.coeff ) - this.rect.height );
			}

			if ( this.heightHandler instanceof Function ) {
				this.heightHandler.call( this, this.node, this.height );
			}
		}
	};

	/**
	 * Метод установки смещения слоя.
	 */
	ParallaxLayer.prototype.setOffset = function() {
		this.dy = ~~( ( this.rect.top - this.wh/2 + this.rect.height/2 ) * this.coeff );

		if ( this.offsetHandler instanceof Function ) {
			this.offsetHandler.call( this, this.node, this.dy );
		}
	};

	/**
	 * Метод для обновления высоты и смещения слоя слоя при ресайзе.
	 */
	ParallaxLayer.prototype.resize = function() {
		this.wh = window.innerHeight;
		this.rect = this.owner.node.getBoundingClientRect();
		this.setOffset();
		this.setHeight();
	};

	/**
	 * Метод для обновления смещения слоя слоя при скролле.
	 */
	ParallaxLayer.prototype.scroll = function() {
		this.rect = this.owner.node.getBoundingClientRect();

		if ( ( this.rect.top < this.wh ) && ( this.rect.bottom > 0 ) ) {
			this.setOffset();
		}
	};

	// Изменение тэга Parallax
	Object.defineProperty( ParallaxLayer.prototype, Symbol.toStringTag, {
		get: function () { return 'ParallaxLayer'; }
	});


	if ( !window.Parallax ) {
		window.Parallax = Parallax;
	} else {
		throw new Error( 'Parallax is already defined or occupied' );
	}

	if ( !window.ParallaxLayer ) {
		window.ParallaxLayer = ParallaxLayer;
	} else {
		throw new Error( 'ParallaxLayer is already defined or occupied' );
	}
})();
