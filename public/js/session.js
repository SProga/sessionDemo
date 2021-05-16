window.addEventListener("load", (event) => {
  const getAllProducts = async () => {
    return await axios("/products/all", { method: "get" })
      .then((response) => {
        return response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const itemListDiv = document.querySelector(".product-list");
  const products = getAllProducts();

  products.then((data) => {
    data.forEach((product) => {
      createProduct(product, itemListDiv);
    });
    addEventHandlers();
    checkoutProduct(); //check session to see if any data is in the cart
  });

  function addEventHandlers() {
    let addItem = document.querySelectorAll(".add");
    addItem.forEach((item) => {
      item.addEventListener("click", () => {
        const product = item.parentElement.textContent;
        addToCart(product);
      });
    });
  }

  const addToCart = async (product) => {
    try {
      return await axios
        .post("/cart", {
          cart: {
            product: product,
          },
        })
        .then((response) => {
          let product = response.data;
          checkoutProduct();
        });
    } catch (e) {
      console.log(e);
    }
  };

  const createProduct = (product, container) => {
    const img = document.createElement("IMG");
    img.src = "/imgs/" + product["img"];
    img.classList.add("icon");
    const item = document.createElement("LI");
    const productItem = product["name"];
    const text = document.createTextNode(productItem);
    const span = document.createElement("SPAN");
    span.classList.add("add");
    item.appendChild(text);
    item.prepend(img);
    item.appendChild(span);
    container.appendChild(item);
  };

  const removeProduct = async (product) => {
    return await axios
      .post("/cart/removeItem", {
        cart: {
          product: product,
        },
      })
      .then((response) => {
        let product = response.data;
        checkoutProduct();
      })
      .catch((err) => console.log(err));
  };

  const productQuantityHandlers = () => {
    let removebutton = document.querySelectorAll(".remove");
    removebutton.forEach((btn) => {
      btn.addEventListener("click", function () {
        const product = btn.parentElement.previousSibling.textContent;
        removeProduct(product);
      });
    });
  };

  const checkoutProduct = async () => {
    return await axios.get("/cart/all").then((response) => {
      const product = response.data;
      if (product.length) {
        checkoutCart(product);
      } else {
        emptyCart();
      }
    });
  };

  const checkoutCart = function (product) {
    let table = document.querySelector(".table");
    let Total = 0;

    table.innerHTML =
      "<tr class='table-heading'><th>Item</th><th>Remove</th><th>Amount</th><th>Price</th></tr>";
    if (product.length > 0) {
      for (let i = 0; i < product.length; i++) {
        let row = table.insertRow(i + 1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        const spanRemove = document.createElement("SPAN");
        spanRemove.classList.add("remove");
        cell1.innerHTML = "<td>" + product[i]["name"] + "</td>";
        cell2.appendChild(spanRemove);
        cell3.innerHTML = "<td>" + product[i]["qty"] + "</td>";
        cell4.innerHTML = "<td>" + "$" + product[i]["price"] + "</td>";
        Total = Total + product[i]["price"];
        productQuantityHandlers();
      }
    }
    let pricerow = table.insertRow(-1);
    pricerow.insertCell(0);
    pricerow.insertCell(1);
    let total = pricerow.insertCell(2);
    let priceCell = pricerow.insertCell(3);
    total.innerHTML = "<td> Total: </td>";
    total.style.backgroundColor = "#fff";
    priceCell.innerHTML = "<td>$" + Total + "</td>";
    priceCell.style.backgroundColor = "#fff";
  };
  function emptyCart() {
    let table = document.querySelector(".table");
    table.innerHTML =
      "<tr class='table-heading'><th>Item</th><th>Remove</th><th>Amount</th><th>Price</th></tr>";
    let noticeRow = document.createElement("TR");
    noticeRow.innerHTML =
      " <td class='cart--info' colspan='4'>Add Products to Cart</td>";
    noticeRow.classList.add(".no-items");
    table.appendChild(noticeRow);
  }
  checkoutProduct();
});
