const cartBtn = document.querySelector(".cart-btn");
const closeCart = document.querySelector(".close-cart");
const cleacrCart = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".close-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//cart
let cart = [];

//buttons
let buttonsDom;

//getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(function (product) {
      result += `
        <article class="product">
          <div class="img-container">
            <img src=${product.image} alt="one" class="product-img" />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              Add to bag
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$ ${product.price}</h4>
        </article>
        `;
    });
    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    const btns = [...document.querySelectorAll(".bag-btn")];
    buttonsDom = btns;
    btns.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "in Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (e) => {
        e.target.innerText = "in Cart";
        e.target.disabled = true;
        //get product from products based on id
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        //add product to the cart
        cart = [...cart, cartItem];

        //save cart in local storage
        Storage.saveCart(cart);

        //set cart values
        this.setCartValues(cart);
        //display cart item
        // show cart
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    console.log(cartTotal, cartItems);
  }
}

//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const ui = new UI();
  const products = new Products();

  //get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
