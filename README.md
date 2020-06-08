# parallax
Простой, гибкий и респонсивный параллакс.  
[Демо](https://codepen.io/OXAYAZA/pen/RgNywY).  

Для работоспособности паралакса в IE11 нужно использовать полифилы для `Function.prototype.name`, `NodeList.prototype.forEach` и `Symbol`.
Их можно подключить с помощью [polyfill.io](https://polyfill.io/v3/polyfill.min.js?features=Function.prototype.name%2CNodeList.prototype.forEach%2CSymbol).  
Где нужно использовать фиксированную позицию слоя относительно вьюпорта лучше использовать `background-attachment: fixed;`.

## API
#### `new Parallax( options );`
Конструктор паралакса.

#### `options`
_Тип: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)_
_Обязательный_
Параметры параллакса.

##### `node`
_Тип: [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)_
_Обязательный_
Элемент DOM из которого будет сделан паралакс.

##### `layerSelector`
_Тип: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)_
_По умолчанию: `.parallax-layer`_
Cелектор дочерних элементов из которых будут сделанны слои паралакса.

##### `layerParams`
_Тип: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)_
_По умолчанию: `data-parallax-layer`_
Имя атрибута с параметрами для каждого слоя, должен содержать JSON.

#### `new ParallaxLayer( options );`
Конструктор слоя паралакса.

##### `options`
_Тип: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)_
_Обязательный_
Параметры слоя параллакса.

##### `node`
_Тип: [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)_
_Обязательный_
Элемент из которого будет сделан слой паралакса.

##### `owner`
_Тип: Parallax_
_Обязательный_
Экземпляр паралакса к которому относится слой.

##### `coeff`
_Тип: [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)_
_По умолчанию: `0.1`_
Коеффициент скорости движенеия слоя по мере скрола страницы.

##### `autosize`
_Тип: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)_
_По умолчанию: `true`_
Автоматический подгон высоты слоя для полного перекрытия родительского элемента при скроле страницы.

##### `onReady`
_Тип: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)_
_По умолчанию: `null`_
Функция обратного вызова выполняющаяся при готовности слоя.

##### `heightHandler`
_Тип: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)_
_По умолчанию:_
```js
function ( node, height ) {
  node.style.height = height +'px';
};
```
функция для обработки значения высоты при подгоне размеров слоя, не вызывается если `autosize: false`.  
Получаемые аргументы:
- `node` - элемент слоя;
- `height` - высота слоя в пикселях.

##### `offsetHandler`
_Тип: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)_
_По умолчанию:_
```js
function ( node, offset ) {
  node.style.top = ( this.rect.height/2 - this.height/2 + offset ) +'px';
};
```
функция для обработки значения смещения слоя при скролле.  
Получаемые аргументы:
- `node` - элемент слоя;
- `offset` - смещение слоя в пикселях.
