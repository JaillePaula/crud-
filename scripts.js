const baseUrl = 'https://649a1d4a79fbe9bcf8404b5a.mockapi.io/users/20201214010020/products';

async function fetchData() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error('Erro ao obter os dados da API.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function renderProducts() {
  const productsList = document.getElementById('productsList');
  const data = await fetchData();

  productsList.innerHTML = '';

  data.forEach(product => {
    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    productItem.innerHTML = `
      <p class="product-name">Nome: ${product.name}</p>
      <p class="product-price">Preço: R$ ${product.price.toFixed(2)}</p>
      <button class="edit-button" onclick="editProduct(${product.id})">Editar</button>
      <button class="delete-button" onclick="deleteProduct(${product.id})">Excluir</button>
    `;
    productsList.appendChild(productItem);
  });
}

async function addProduct(event) {
  event.preventDefault();
  const nameInput = document.getElementById('nameInput');
  const priceInput = document.getElementById('priceInput');

  const newProduct = {
    name: nameInput.value,
    price: parseFloat(priceInput.value),
  };

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar o produto.');
    }

    nameInput.value = '';
    priceInput.value = '';
    renderProducts();
  } catch (error) {
    console.error(error);
  }
}

async function editProduct(productId) {
  const newName = prompt('Digite o novo nome do produto:');
  const newPrice = parseFloat(prompt('Digite o novo preço do produto:'));

  const updatedProduct = {
    name: newName,
    price: newPrice,
  };

  try {
    const response = await fetch(`${baseUrl}/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
      throw new Error('Erro ao editar o produto.');
    }

    renderProducts();
  } catch (error) {
    console.error(error);
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`${baseUrl}/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir o produto.');
    }

    renderProducts();
  } catch (error) {
    console.error(error);
  }
}

document.getElementById('productForm').addEventListener('submit', addProduct);

renderProducts();
