// Função para adicionar um novo item à árvore
function addItem() {
  const itemInput = document.getElementById("item-input");
  const itemName = itemInput.value.trim();

  const parentSelect = document.getElementById("parent-select");
  const selectedParentValue = parentSelect.value;

  if (itemName) {
    const newItem = {
      name: itemName,
      checked: false,
      children: [],
    };

    const itemList = JSON.parse(localStorage.getItem("itemList")) || [];

    if (selectedParentValue !== "") {
      // Encontre o item pai com base no valor selecionado no select
      const selectedParent = findItemByValue(itemList, selectedParentValue);

      if (selectedParent) {
        selectedParent.children.push(newItem);
      }
    } else {
      // Adicionar como um item principal
      itemList.push(newItem);
    }

    localStorage.setItem("itemList", JSON.stringify(itemList));

    itemInput.value = "";
    displayItems();
    displayItemsInSelect(); // Atualize as opções do select
  }
}

// Função para encontrar um item com base no valor do select
function findItemByValue(items, value) {
  const indices = value.split("-").map((index) => parseInt(index));

  let currentItem = items;
  for (const index of indices) {
    currentItem = currentItem[index].children;
  }

  return currentItem.length > 0 ? currentItem[0] : null;
}

// Função para editar o nome de um item
function editItemName(index) {
  const itemList = JSON.parse(localStorage.getItem("itemList")) || [];
  const newName = prompt(
    "Digite o novo nome para o item:",
    itemList[index].name
  );

  if (newName !== null) {
    itemList[index].name = newName;
    localStorage.setItem("itemList", JSON.stringify(itemList));
    displayItems();
    displayItemsInSelect(); // Atualize as opções do select
  }
}

// Função para excluir um item
function deleteItem(index) {
  const itemList = JSON.parse(localStorage.getItem("itemList")) || [];
  itemList.splice(index, 1);
  localStorage.setItem("itemList", JSON.stringify(itemList));
  displayItems();
  displayItemsInSelect(); // Atualize as opções do select
}

// Função para exibir os itens no select (incluindo itens filhos)
function displayItemsInSelect() {
  const itemList = JSON.parse(localStorage.getItem("itemList")) || [];
  const parentSelect = document.getElementById("parent-select");

  // Limpe todas as opções existentes
  parentSelect.innerHTML =
    '<option value="">Selecione um pai (opcional)</option>';

  // Função recursiva para percorrer os itens e adicionar como opções no select
  function addItemsToSelect(items, prefix = "") {
    items.forEach((item, index) => {
      const itemName = prefix + item.name;

      const option = document.createElement("option");
      option.value = `${prefix}${index}`;
      option.textContent = itemName;
      parentSelect.appendChild(option);

      if (item.children && item.children.length > 0) {
        addItemsToSelect(item.children, `${prefix}${index}-`);
      }
    });
  }

  addItemsToSelect(itemList);
}

// Função para exibir os itens na página
function displayItems() {
  const itemList = JSON.parse(localStorage.getItem("itemList")) || [];
  const itemListContainer = document.getElementById("item-list");
  const parentSelect = document.getElementById("parent-select");

  itemListContainer.innerHTML = "";
  parentSelect.innerHTML =
    '<option value="">Selecione um pai (opcional)</option>';

  // Função para criar elementos HTML para um item
  function createItemElement(item, index = false) {
    const itemDiv = document.createElement("div");
    const isChecked = item.checked;

    itemDiv.innerHTML = `
        <label class="checkbox-wrapper">
            <input type="checkbox" id="item-${index}"
            onchange="updateItem(${index})" ${isChecked ? "checked" : ""}>
            ${item.name}
        </label>
        <button onclick="editItemName(${index})" class="btnEdit">Editar</button>
        <button onclick="deleteItem(${index})">Excluir</button>
      `;

    itemListContainer.appendChild(itemDiv);

    if (item.children && item.children.length > 0) {
      const childrenList = document.createElement("ul");

      childrenList.style.listStyleType = "none";

      item.children.forEach((child, childIndex) => {
        const childListItem = document.createElement("li");
        const childItemElement = createItemElement(
          child,
          `${index}-${childIndex}`,
          true
        );
        childListItem.appendChild(childItemElement);
        childrenList.appendChild(childListItem);
      });

      childrenList.style.marginLeft = "15px";

      itemDiv.appendChild(childrenList);
    }

    return itemDiv;
  }

  itemList.forEach((item, index) => {
    // Crie os elementos HTML para cada item
    const itemElement = createItemElement(item, index);
  });
}

// Função para atualizar um item
function updateItem(index) {
  const itemList = JSON.parse(localStorage.getItem("itemList")) || [];
  const itemCheckbox = document.getElementById(`item-${index}`);
  itemList[index].checked = itemCheckbox.checked;

  // Atualize a seleção dos itens filhos
  updateChildrenSelection(itemList, index, itemCheckbox.checked);

  localStorage.setItem("itemList", JSON.stringify(itemList));
}

// Função para atualizar a seleção dos itens filhos
function updateChildrenSelection(itemList, parentIndex, checked) {
  const parentItem = itemList[parentIndex];

  if (parentItem.children && parentItem.children.length > 0) {
    parentItem.children.forEach((child, childIndex) => {
      const childCheckbox = document.getElementById(
        `item-${parentIndex}-${childIndex}`
      );

      if (childCheckbox) {
        childCheckbox.checked = checked;
        child.checked = checked;
        updateChildrenSelection(
          itemList,
          `${parentIndex}-${childIndex}`,
          checked
        );
      }
    });
  }
}

// Chame a função displayItems e displayItemsInSelect para carregar os itens ao carregar a página
displayItems();
displayItemsInSelect();
