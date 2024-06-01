const API_URL = "https://melon-truth-protocol.glitch.me"; // адрес сервера

const button = document.querySelectorAll(".shop__category-btn"); // получаем кнопку
const productList = document.querySelector(".shop__list"); // получаем список
const basketBtn = document.querySelector(".shop__btn-card"); // получаем кнопку карзины
const basketCnt = basketBtn.querySelector(".shop__cnt-card"); // цифру а иконке корзины
const modal = document.querySelector(".modal-overlay"); // получаем модальное окно
const cartList = document.querySelector(".modal__cart-list"); // получаем список МО

const modalCloseBtn = document.querySelector(".modal-overlay__close-btn"); // получаем кнопку закрыть МО
const modalItemPrice = document.querySelector(".modal__footer-price"); // прайс
const modalForm = document.querySelector(".modal__form"); // форма в МО

// API Block
// const createProductCard = (product) =>  такой записью мы получаем обект данных и в нужных местах обрвщалмсь бы к его ключам вытаскивая значения
// а нижней записью мы сразу записываем ключи в скобки (обычные и фигурные)и где нужно получаем их значения
const createProductCard = ({ id, photoUrl, name, price }) => {
	// сама карточка
	const productCard = document.createElement("li"); // создаем элемент списка
	productCard.classList.add("shop__item"); // добавляем класс
	productCard.innerHTML = `
							<article class="shop__product product">
								<img
									class="product__img"
									src="${API_URL}${photoUrl}"
									alt="${name}"
									width="388"
									height="261"
								/>

								<h3 class="product__title">${name}</h3>

								<p class="product__price">${price}&nbsp;₽</p>

								<button class="product__add-card" data-id='${id}'>Заказать</button>
							</article>
	`; // создаем в этом 'li' html верстку элемента; фото получаем обращаясь через URL адрес сервера
	return productCard;
};

const renderProducts = (products) => {
	//функция принимает продукт(products) создает карточки и рендерит их на страницу
	productList.textContent = ""; // Очищаем старый список

	products.forEach((products) => {
		// перебираем новый список
		const productCard = createProductCard(products); // создаем саму карточку, передаем объект данных
		productList.append(productCard); // вставляем картточку на страницу в старый список
	});
};

const fetchProductCategory = async (category) => {
	// запрашивает данные по API
	try {
		const response = await fetch(
			`${API_URL}/api/products/category/${category}`
		);
		if (!response.ok) {
			throw new Error(response.status);
		}

		const products = await response.json(); // Получаем данные

		renderProducts(products); // вызываем функцию рендера карточек и передаем полученые данные товара
		// console.log(products);
	} catch (error) {
		console.error(`Ошибка запроса товара: ${error}`);
	}
};

//
const fetchBasketItems = async (ids) => {
	try {
		const response = await fetch(
			`${API_URL}/api/products/list/${ids.join(",")}`
		);

		if (!response.ok) {
			throw new Error(response.status);
		}
		return await response.json();
	} catch (error) {
		console.error(`Ошибка запроса товаров: ${error}`);
		return [];
	}
};

// event это объект который мы можем полчать, вызывавть методы, деструктурировать
// получаем event для того что бы у него получить target и работать с ним
//свойство tdrget позволяет нам выявить элемент по которому кликнули
// записыаем свойство target в переменную
const changeCategory = (event) => {
	const target = event.target;
	const category = target.textContent;

	button.forEach((btn) => {
		btn.classList.remove("shop__category-btn_active"); //изначально удаляем модифекатор активности
	});

	target.classList.add("shop__category-btn_active");
	fetchProductCategory(category);
};

button.forEach((btn) => {
	btn.addEventListener("click", changeCategory);

	//Узнаем присутствует ли у данной категории модифекатор активности: _active
	if (btn.classList.contains("shop__category-btn_active")) {
		fetchProductCategory(btn.textContent);
	}
});


//подсчет суммы заказа в иконке 'корзины'
const calcTotalPrice = (cartItems, products) => cartItems.reduce((acc, item) => {
	const product = products.find((prod) => prod.id === item.id); 
	return acc + product.price * item.count
}, 0);
//рендер товара в модальном окне
// сразу очищаем элементы списка для безопасности
// получаем значение localStorage и перебираем его через forEach, на каждой итерации создаем 'li' элемент и записываем в него полученое значение при переборе
const renderBasketItem = async () => {
	cartList.textContent = "";
	const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
	const products = JSON.parse(
		localStorage.getItem("cartProductDetailes") || "[]"
	);

	products.forEach(({ id, photoUrl, name, price }) => {
		const cartItem = cartItems.find((item) => item.id === id);
		if (!cartItem) {
			return;
		}

		const listItem = document.createElement("li");
		listItem.classList.add("modal__cart-item");
		listItem.innerHTML = `
							<img
							class="modal__cart-item-img"
								src="${API_URL}${photoUrl}"
								alt="${name}"
							/>

							<h3 class="modal__item-title">${name}</h3>

							<div class="modal__item-count">
								<button class="modal__count-btn modal__minus" data-id=${id}>-</button>
								<span class="modal__count">${cartItem.count}</span>
								<button class="modal__count-btn modal__plus" data-id=${id}>+</button>
							</div>

							<p class="modal__item-price">${price * cartItem.count}&nbsp;₽</p>
		`;
		cartList.append(listItem);
	});

	const totalPrice = calcTotalPrice(cartItems, products);
	modalItemPrice.innerHTML = `${totalPrice}&nbsp;₽`;
};

//вешаем событие на кнопку корзины
basketBtn.addEventListener("click", async () => {
	modal.style.display = "flex"; // у МО меняем свойство на с none на флекс, благодаря этому оно появляется

	const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
	const ids = cartItems.map((item) => item.id);

	if (!ids.length) {
		cartList.textContent = "";
		const listItem = document.createElement("li");
		listItem.textContent = "В корзине пусто";
		cartList.append(listItem);
		return;
	}

	const products = await fetchBasketItems(ids);
	localStorage.setItem("cartProductDetailes", JSON.stringify(products));
	renderBasketItem();
});

//Другой вариант получения свойства target, которое  позволяет нам выявить элемент по которому кликнули
modal.addEventListener("click", ({ target }) => {
	// если target строго равен МО тогда мы закрываем МО или клик произошел на элемент с классом
	if (target === modal || target.closest(".modal-overlay__close-btn")) {
		modal.style.display = "none";
	}
});

// Изменяем число в иконке корзины в зависимости от товаров находящихся в localStorage
//
const updateBasketCount = () => {
	const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
	basketCnt.textContent = cartItems.length;
};

updateBasketCount();

// localStorage - хронилище в браузере, обращаясь к нему можно вытянуть нужную информацию
// localStorage.getItem("cartItems"); забираем из хронилища значение ключа "cartItems". Получаем либо значение либо null
// localStorage.setItem("cartItems", JSON.stringify(['привет', 'hello'])); записываем в хронилище значение ключа "cartItems" слово 'привет' и 'hello', с помощью преобразования в JSON для удобства работы
// с помощью JSON.parse преобразуем из JSON
const addToBasket = (productId) => {
	// добавление в корзину
	const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
	const existingItem = cartItems.find((item) => item.id === productId); // проверяем есть ли такой товар в корзине

	if (existingItem) {
		existingItem.count += 1;
	} else {
		cartItems.push({ id: productId, count: 1 });
	}

	localStorage.setItem("cartItems", JSON.stringify(cartItems));

	updateBasketCount();
};

// кликаем внутри списка товаров, получаем target, проверяем пирсутствует ли у кнопки нужный класс и если присутствует  то мы создаем переменную с target.dataset.id значением которое дает нам id элемента, затем / мы создаем productName и в нем получаем значение textContent нужного класса. В общем мы записываем товар в localStorage по id
productList.addEventListener("click", ({ target }) => {
	if (target.closest(".product__add-card")) {
		const productId = target.dataset.id;

		addToBasket(productId);
	}
});

const updateBasketItems = (prodId, num) => {
	const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
	const itemIndex = cartItems.findIndex(item => item.id === prodId)

	if(itemIndex !== -1){
		cartItems[itemIndex].count += num
	}

	if(cartItems[itemIndex].count <= 0){
		cartItems.splice(itemIndex, 1)
	}
	localStorage.setItem('cartItems', JSON.stringify(cartItems))

	updateBasketCount()
	renderBasketItem()
}

cartList.addEventListener('click', ({target}) => {
	if(target.classList.contains('modal__plus')){
		const prodId = target.dataset.id
		updateBasketItems(prodId, 1)
	}

	if(target.classList.contains('modal__minus')){
		const prodId = target.dataset.id
		updateBasketItems(prodId, -1)
	}
})



// Запрос на отправку формы

// не дает перезагружаться странице при отправке формы
const submitOrder = ((event) => {
	event.preventDefault() 

	const storId = modalForm.shop.value // получаем число из атрибута 'name' у инпутьв с адресами
	const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
	// берем каждый полученный элемент, перебираем его через 'map' и возвращаем обратно только нужные нам элементы с нужными нам атребутани
	const products = cartItems.map(({id, count}) => ({
		id,
		quantity: count
	}))

	console.log('products: ', products)

	// try{

	// } catch()
})


modalForm.addEventListener('submit', submitOrder)

