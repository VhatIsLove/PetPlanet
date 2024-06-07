export const API_URL = "https://melon-truth-protocol.glitch.me"; // адрес сервера

const fetchData = async (endpoint, option = {}) => {
	try{
		const response = await fetch(`${API_URL}${endpoint}`, option);

		if (!response.ok) {
			throw new Error(response.status);
		}

		return await response.json();

	} catch (error){
		console.error(`Ошибка запроса: ${error}`);
	}
}

// запрашиваем данные по API
export const fetchProductCategory = (category) => 
	fetchData(`/api/products/category/${category}`)
	

//
export const fetchBasketItems = async (ids) => 
	fetchData(`/api/products/list/${ids.join(",")}`)

// Запрос на отправку формы
// не дает перезагружаться странице при отправке формы
export const submitOrder = async (storeId, products) => 
	fetchData(`/api/orders`, {
		method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({storeId, products}),
	})
