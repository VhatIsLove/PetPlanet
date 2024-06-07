import { fetchBasketItems, submitOrder, } from "./api"
import { renderBasketItem, createOrderMassage } from './dom-controller'


const basketBtn = document.querySelector(".shop__btn-card"); //  кнопка карзины
const basketCnt = basketBtn.querySelector(".shop__cnt-card"); // цифра в иконке корзины
//Модальное окно
const modal = document.querySelector(".modal-overlay"); //  модальное окно
const cartList = document.querySelector(".modal__cart-list"); //  список
const modalCloseBtn = document.querySelector(".modal-overlay__close-btn"); // кнопку закрыть 
const modalItemPrice = document.querySelector(".modal__footer-price"); // прайс
const modalForm = document.querySelector(".modal__form"); // форма

//подсчет суммы заказа в иконке 'корзины'
const calcTotalPrice = (cartItems, products) => cartItems.reduce((acc, item) => {
	const product = products.find((prod) => prod.id === item.id); 
	return acc + product.price * item.count
}, 0);

// Изменяем число в иконке корзины в зависимости от товаров находящихся в
const updateBasketCount = () => {
	const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
	basketCnt.textContent = cartItems.length;
};

// добавление товара в корзину
export const addToBasket = (productId) => {
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

	const products = JSON.parse(
		localStorage.getItem("cartProductDetailes") || "[]"
	)

	updateBasketCount()
	renderBasketItem(cartList, cartItems, products)
}



// Обработчики

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


//вешаем событие на кнопку корзины
basketBtn.addEventListener("click", async () => {
	modal.style.display = "flex"; // у МО меняем свойство на с 'none' на флекс, благодаря этому оно появляется

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
	renderBasketItem(cartList, cartItems, products);

	const totalPrice = calcTotalPrice(cartItems, products);
	modalItemPrice.innerHTML = `${totalPrice}&nbsp;₽`;
});

modal.addEventListener("click", ({ target }) => {
	// если target строго равен МО тогда мы закрываем МО или клик произошел на элемент с классом
	if (target === modal || target.closest(".modal-overlay__close-btn")) {
		modal.style.display = "none";
	}
});

modalForm.addEventListener('submit', async (event) => {
	event.preventDefault(); 

	const storeId = modalForm.shop.value // получаем число из атрибута 'name' у инпутьв с адресами
	const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
	// берем каждый полученный элемент, перебираем его через 'map' и возвращаем обратно только нужные нам элементы с нужными нам атребутани
	const products = cartItems.map(({id, count}) => ({
		id,
		quantity: count
	}));

	const {orderId} = await submitOrder(storeId, products)

	localStorage.removeItem('cartItems')
	localStorage.removeItem('cartProductDetailes')

	
	document.body.append(createOrderMassage(orderId)) // добавляем элемент на страницу
	modal.style.display = 'none'
	updateBasketCount();
})

updateBasketCount();