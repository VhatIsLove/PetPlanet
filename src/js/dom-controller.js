import {API_URL} from './api'

// Создаем DOM элементы

const createOrderMassage = (id) => {
	const orderMassageEl = document.createElement('div'); // добавляем элемент
	orderMassageEl.classList.add('order-massage')// добавляем ему класс

	const orderMassageText = document.createElement('p'); // 
	orderMassageText.classList.add('order-massage__text')// добавляем ему класс
	orderMassageText.textContent = `Ваш заказ оформлен. Номер ${orderId}.`

	const orderMassageBtn = document.createElement('button'); // 
	orderMassageBtn.classList.add('order-massage__button')// добавляем ему класс
	orderMassageBtn.textContent = 'Закрыть'

	orderMassageEl.append(orderMassageText, orderMassageBtn)

	orderMassageBtn.addEventListener('click', () => {
		orderMassageEl.remove()

		return orderMassageEl
	})
}

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

export const renderProducts = (products, productList) => {
	//функция принимает продукт(products) создает карточки и рендерит их на страницу
	productList.textContent = ""; // Очищаем старый список

	products.forEach((products) => {
		// перебираем новый список
		const productCard = createProductCard(products); // создаем саму карточку, передаем объект данных
		productList.append(productCard); // вставляем картточку на страницу в старый список
	});
};

//рендер товара в модальном окне
// сразу очищаем элементы списка для безопасности
// получаем значение localStorage и перебираем его через forEach, на каждой итерации создаем 'li' элемент и записываем в него полученое значение при переборе
const renderBasketItem = async () => {
	cartList.textContent = "";
	const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
	const products = JSON.parse(localStorage.getItem("cartProductDetailes") || "[]");

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
