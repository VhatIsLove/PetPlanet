export const API_URL = "https://melon-truth-protocol.glitch.me"; // адрес сервера

// запрашиваем данные по API
export const fetchProductCategory = async (category) => {
	try {
		const response = await fetch(
			`${API_URL}/api/products/category/${category}`
		);
		
		if (!response.ok) {
			throw new Error(response.status);
		}

		const products = await response.json(); // Получаем данные

		return products // вызываем функцию рендера карточек и передаем полученые данные товара
	} catch (error) {
		console.error(`Ошибка запроса товара: ${error}`);
	}
};

//
export const fetchBasketItems = async (ids) => {
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

// Запрос на отправку формы
// не дает перезагружаться странице при отправке формы
export const submitOrder = async (storeId, products) => {
	
	try{
		const response = await fetch(`${API_URL}/api/orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({storeId, products}),
		});
		
		if(!response.ok){
			throw new Error(response.status);
		} 

		return await response.json();
		
		} catch(error){
			console.error('Ошибка оформления заказа:');
		}
}
