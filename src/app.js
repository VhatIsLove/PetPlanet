import { fetchProductCategory } from "./js/api";
import { addToBasket } from "./js/basket";
import { renderProducts } from "./js/dom-controller";
 
const button = document.querySelectorAll(".shop__category-btn"); //  кнопка категорий
const productList = document.querySelector(".shop__list"); //  список товаров на странице

// API Block
// const createProductCard = (product) =>  такой записью мы получаем обект данных и в нужных местах обрвщалмсь бы к его ключам вытаскивая значения
// а нижней записью мы сразу записываем ключи в скобки (обычные и фигурные)и где нужно получаем их значения


// event это объект который мы можем полчать, вызывавть методы, деструктурировать
// получаем event для того что бы у него получить target и работать с ним
//свойство tdrget позволяет нам выявить элемент по которому кликнули
// записыаем свойство target в переменную
const changeCategory = async ({ target }) => {
	const category = target.textContent;

	button.forEach((btn) => {
		btn.classList.remove("shop__category-btn_active"); //изначально удаляем модифекатор активности
	});

	target.classList.add("shop__category-btn_active");

	const products = await fetchProductCategory(category);
	renderProducts(products, productList)
};

button.forEach((btn) => {
	btn.addEventListener("click", changeCategory);

	//Узнаем присутствует ли у данной категории модифекатор активности: _active
	if (btn.classList.contains("shop__category-btn_active")) {
		changeCategory({target: btn})
	}
});

//Другой вариант получения свойства target, которое  позволяет нам выявить элемент по которому кликнули

// localStorage - хронилище в браузере, обращаясь к нему можно вытянуть нужную информацию
// localStorage.getItem("cartItems"); забираем из хронилища значение ключа "cartItems". Получаем либо значение либо null
// localStorage.setItem("cartItems", JSON.stringify(['привет', 'hello'])); записываем в хронилище значение ключа "cartItems" слово 'привет' и 'hello', с помощью преобразования в JSON для удобства работы
// с помощью JSON.parse преобразуем из JSON


// кликаем внутри списка товаров, получаем target, проверяем пирсутствует ли у кнопки нужный класс и если присутствует  то мы создаем переменную с target.dataset.id значением которое дает нам id элемента, затем / мы создаем productName и в нем получаем значение textContent нужного класса. В общем мы записываем товар в localStorage по id
productList.addEventListener("click", ({ target }) => {
	if (target.closest(".product__add-card")) {
		const productId = target.dataset.id;

		addToBasket(productId);
	}
});