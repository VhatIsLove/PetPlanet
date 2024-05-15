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
