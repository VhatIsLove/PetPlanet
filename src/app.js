const API_URL = "https://melon-truth-protocol.glitch.me"; // адрес сервера

const button = document.querySelectorAll(".shop__category-btn"); // получаем кнопку
const productList = document.querySelector(".shop__list"); // получаем список
const basketBtn = document.querySelector(".shop__btn-card"); // получаем кнопку карзины
const modal = document.querySelector(".modal-overlay"); // получаем модальное окно
const cartList = document.querySelector(".modal__cart-list"); // получаем список МО

const modalCloseBtn = document.querySelector(".modal-overlay__close-btn"); // получаем кнопку закрыть МО

// API Block
// const createProductCard = (product) =>  такой записью мы получаем обект данных и в нужных местах обрвщалмсь бы к его ключам вытаскивая значения
// а нижней записью мы сразу записываем ключи в скобки (обычные и фигурные)и где нужно получаем их значения
const createProductCard = ({ photoUrl, name, price }) => {
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

//вешаем событие на кнопку корзины
basketBtn.addEventListener("click", () => {
	modal.style.display = "flex"; // у МО меняем свойство на с none на флекс, благодаря этому оно появляется
});

//Другой вариант получения свойства tdrget, которое  позволяет нам выявить элемент по которому кликнули
modal.addEventListener("click", ({ target }) => {
	// если target строго равен МО тогда мы закрываем МО или клик произошел на элемент с классом
	if (target === modal || target.closest(".modal-overlay__close-btn")) {
		modal.style.display = "none";
	}
});

// 23min
