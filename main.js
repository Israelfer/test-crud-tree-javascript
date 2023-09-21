// Função para adicionar um novo item à árvore
function addItem() {
  const itemInput = document.getElementById("item-input");
  const itemName = itemInput.value.trim();

  const parentSelect = document.getElementById("parent-select");
  const selectedParentIndex = parentSelect.selectedIndex;

  if (itemName) {
    const newItem = {
      name: itemName,
      children: [],
    };

    const itemList = JSON.parse(localStorage.getItem("itemList")) || [];

    if (selectedParentIndex > 0) {
      // Adicionar como filho do item selecionado no select
      const selectedParent = itemList[selectedParentIndex - 1];
      selectedParent.children.push(newItem);
    } else {
      // Adicionar como um item principal
      itemList.push(newItem);
    }

    localStorage.setItem("itemList", JSON.stringify(itemList));

    itemInput.value = "";
    displayItems();
  }
}

function displayItems() {
  const itemList = JSON.parse(localStorage.getItem("itemList")) || [];
  const itemListContainer = document.getElementById("item-list");
  const parentSelect = document.getElementById("parent-select");

  itemListContainer.innerHTML = "";
  parentSelect.innerHTML =
    '<option value="">Selecione um pai (opcional)</option>';

  // Função para criar elementos HTML para um item
  function createItemElement(item, index, isChild = false) {
    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `
          <input type="checkbox" id="item-${index}" onchange="updateItem(${index})" ${
      item.checked ? "checked" : ""
    }>
          <label for="item-${index}">${item.name}</label>
          <button onclick="deleteItem(${index})">Excluir</button>
          <button onclick="editItemName(${index})">Editar</button> <!-- Botão de edição -->
      `;

    // Adicione uma margem à esquerda de 15px se o item for um filho
    if (isChild) {
      itemDiv.style.marginLeft = "15px";
    }

    itemListContainer.appendChild(itemDiv);

    // Verifica se o item tem filhos
    if (item.children && item.children.length > 0) {
      const childrenList = document.createElement("ul");

      // Remova a lista de marcadores (bullets) dos itens filhos
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

      // Defina a margem esquerda para a lista de filhos
      childrenList.style.marginLeft = "15px";

      itemDiv.appendChild(childrenList);
    }

    return itemDiv;
  }

  itemList.forEach((item, index) => {
    // Adicione as opções ao select com base nos itens existentes
    const option = document.createElement("option");
    option.value = index.toString();
    option.textContent = item.name;
    parentSelect.appendChild(option);

    // Crie os elementos HTML para cada item
    const itemElement = createItemElement(item, index);
  });
}

function updateItem(index) {
  const itemList = JSON.parse(localStorage.getItem("itemList")) || [];
  const itemCheckbox = document.getElementById(`item-${index}`);
  const item = itemList[index];

  // Atualize a seleção do item
  item.checked = itemCheckbox.checked;

  // Atualize a seleção dos itens filhos
  updateChildrenSelection(itemList, index, itemCheckbox.checked);

  localStorage.setItem("itemList", JSON.stringify(itemList));
}

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
  }
}

// Função para excluir um item
function deleteItem(index) {
  const itemList = JSON.parse(localStorage.getItem("itemList")) || [];
  itemList.splice(index, 1);
  localStorage.setItem("itemList", JSON.stringify(itemList));
  displayItems();
}

// Chame a função displayItems para carregar os itens armazenados no Local Storage ao carregar a página
displayItems();
