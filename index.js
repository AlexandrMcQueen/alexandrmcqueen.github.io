const contentInner = document.getElementById("content-inner");
const mainDisclosure = document.getElementById("main-disclosure");
const itemsInner = document.getElementById("items");
const svgToTransform = document.getElementById("svg__icon__resize");
const cartContainer = document.getElementById("cart");
const openCartButton = document.getElementById("svg__icon");
const closeCartButton = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const productsPerPage = 24;
const cart = [];

mainDisclosure.addEventListener("click", () => {
  contentInner.classList.toggle("active");
  svgToTransform.classList.toggle("svg-icon-transform");
});

openCartButton.addEventListener("click", () => {
  cartContainer.style.right = "0";
});

closeCartButton.addEventListener("click", () => {
  cartContainer.style.right = "-400px"; // Hide the cart
});

const getItems = async (currentPage = 1) => {
  try {
    const itemsUrl = `https://voodoo-sandbox.myshopify.com/products.json?page=${currentPage}&limit=${productsPerPage}`;
    const { products } = await fetch(itemsUrl).then((res) => res.json());

    itemsInner.innerHTML = "";

    renderProducts(products);
  } catch (err) {
    console.log(`ERROR : ` + err);
    alert(`Something went wrong, try again a bit later`);
  }
};

getItems();

// PAGINATION
const pagination = document.getElementById("pagination");
const totalPages = 20; // Total number of pages

// Function to generate pagination items

function generatePagination(currentPagePagination) {
  pagination.innerHTML = ""; // Clear existing pagination

  for (let i = 1; i <= totalPages; i++) {
    const listItem = document.createElement("li");
    listItem.classList.add("pagination-item");

    if (i === currentPagePagination) {
      listItem.classList.add("active");
    }

    listItem.textContent = i;

    pagination.appendChild(listItem);

    listItem.addEventListener("click", () => {
      // Update pagination when a page number is clicked

      generatePagination(i);
      getItems(i);

      scrollTo(0, 100);
      console.log(currentPagePagination);
    });
  }
}

// Initial pagination generation
generatePagination(1);
const renderProducts = (products) => {
  itemsInner.innerHTML = products
    .map((product) => renderProductCard(product))
    .join("");
};

const renderProductCard = (product) => {
  return `
    <div  class="flex flex-col max-w-[280px] relative">

                    <div class="w-[280px] h-[300px] rounded border-black border mt-12 ">
                        <img class="h-full w-full object-cover" src="${
                          product.images[0]
                            ? product?.images[0]?.src
                            : "/images/default-image_450.png"
                        }" alt="Image">

                    </div>

                    <div class="flex justify-between items-center pt-3">
                        <div class=" text-black font-bold flex flex-col max-w-[175px] min-w-0"> 
                            <p class="truncate">${product.title}</p>
                            <h3 class="price">${
                              product.variants[0]?.price
                            } KR.</h3>
                        </div>


                        <div class="flex flex-col">
                            <h3 class="font-medium">Condition</h3>
                            <h3 class="font-normal">Slightly used</h3>
                        </div>

                    </div>


        <button 
          class="add-to-cart-button py-3 w-full rounded bg-black border text-white mt-3 mb-10 hover:text-black hover:bg-white hover:border-black"
          data-product-id="${product.id}"
          data-product-title="${product.title}"
          data-product-image="${
            product.images[0]?.src || "/images/default-image_450.png"
          }"
          data-product-price="${product.variants[0]?.price || 0}">
          ADD TO CART
        </button>
    </div>
  `;
};

// Event listener for adding items to the cart
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-button")) {
    const productId = e.target.getAttribute("data-product-id");
    const existingCartItem = cart.find((item) => item.id === productId);

    if (existingCartItem) {
      existingCartItem.qty++;
    } else {
      const product = {
        id: productId,
        title: e.target.getAttribute("data-product-title"),
        price: parseFloat(e.target.getAttribute("data-product-price")),
        image: e.target.getAttribute("data-product-image"),
        qty: 1,
      };
      cart.push(product);
    }

    updateCartUI();
  }
});

// Event listener for updating item quantity in the cart
cartItems.addEventListener("click", (e) => {
  const productId = e.target.getAttribute("data-product-id");
  const cartItem = cart.find((item) => item.id === productId);

  if (!cartItem) return;

  if (e.target.id === "add-btn") {
    cartItem.qty++;
  } else if (e.target.id === "minus-btn") {
    if (cartItem.qty > 1) {
      cartItem.qty--;
    }
  } else if (e.target.id === "delete-btn") {
    const itemIndex = cart.indexOf(cartItem);
    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
    }
  }

  updateCartUI();
});

const updateCartUI = () => {
  cartItems.innerHTML = "";
  const cartTotalValue = cart.reduce(
    (acc, product) => acc + product.price * product.qty,
    0
  );

  cartTotal.textContent = cartTotalValue.toFixed(2) + " KR.";

  cartItems.innerHTML = cart
    .map((cartItem) => renderCartItem(cartItem))
    .join("");
};

const renderCartItem = (cartItem) => {
  return `
    <div class="cart-item flex justify-between">
        <!-- Cart item HTML here -->
        <!-- ... -->
        <div class="flex gap-4">
            <div class="rounded border border-[#FFFFFF80] w-[74px] h-[74px] ">
                            <img class="h-full" src="${cartItem.image}" alt="cart-image">
                        </div>

                        <div class="flex flex-col text-sm text-white font-bold min-w-0 gap-2">
                            <h3 class=" max-w-[70px]">${cartItem.title}</h3>
                            <h3 class="price">${cartItem.price} KR.</h3>
                            <div class="flex gap-1">
                                <h3 data-product-id="${cartItem.id}" data-product-qt="${cartItem.qty}" id="minus-btn" class="cursor-pointer ">-</h3>
                                <h3 class="qty">${cartItem.qty}</h3>
                                <h3 data-product-id="${cartItem.id}"  data-product-qt="${cartItem.qty}" id="add-btn" class="cursor-pointer ">+</h3>
                            </div>
                        </div>
        </div>
        <div class="cursor-pointer">
              <svg data-product-id="${cartItem.id}"  id="delete-btn" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_2720_971)">
                                <path d="M7 4V2H17V4H22V6H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z" fill="#FCF7E6"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_2720_971">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
           </svg>
        </div>
    </div>
  `;
};

getItems();
