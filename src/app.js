const button = document.querySelectorAll(".shop__category-btn");

const activeBtn = (event) => {
	const target = event.target;

	button.forEach((btn) => {
		btn.classList.remove("shop__category-btn_active");
	});

	target.classList.add("shop__category-btn_active");
};

button.forEach((btn) => {
	btn.addEventListener("click", activeBtn);
});

// API Block

const API_URL = "https://melon-truth-protocol.glitch.me"; // адрес сервера
const productList = document.querySelector(".shop__list");

const createProductCard = (product) => {
	// сама карточка
	const productCard = document.createElement("li"); // создаем элемент списка
	productCard.classList.add("shop__item"); // добавляем класс
	productCard.innerHTML = `
							<article class="shop__product product">
								<img
									class="product__img"
									src="${API_URL}${product.photoUrl}"
									alt="${product.name}"
									width="388"
									height="261"
								/>

								<h3 class="product__title">${product.name}</h3>

								<p class="product__price">${product.price}&nbsp;₽</p>

								<button class="product__add-card">Заказать</button>
							</article>
	`; // создаем в этом 'li' html верстку элемента; фото получаем обращаясь через URL адрес сервера
	return productCard;
};

const renderProducts = (products) => {
	//функция принимает продукт(products) создает карточки и рендерит их на страницу
	productList.textContent = ""; // Очищаем старый список

	products.forEach((products) => {
		// перебираем новый список
		const productCard = createProductCard(products); // создаем саму карточку
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
			throw new Error(`Something went wrong: ${response.status}`);
		}

		const products = await response.json(); // Получаем данные

		renderProducts(products); // вызываем функцию рендера карточек и передаем полученые данные товара
		// console.log(products);
	} catch (error) {
		console.error(`Ошибка запроса товара: ${error}`);
	}
};

fetchProductCategory("Домики");
