function createItem(itemName, parentItemId) {
  const existingItems = JSON.parse(localStorage.getItem("items")) || [];

  const newItem = {
    id: Date.now(),
    name: itemName,
    parentId: parentItemId || null,
  };

  existingItems.push(newItem);

  localStorage.setItem("items", JSON.stringify(existingItems));

  readTree();
  updateParentSelect();
}

function updateParentSelect() {
  const parentSelect = document.getElementById("parentItem");
  const items = JSON.parse(localStorage.getItem("items")) || [];

  parentSelect.innerHTML =
    '<option value="">Selecione o Pai (opcional)</option>';

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    parentSelect.appendChild(option);
  });
}

function addDeleteButton(item) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Excluir";
  deleteButton.addEventListener("click", function () {
    deleteItem(item.id);
    readTree();
  });
  return deleteButton;
}

function readTree() {
  const items = JSON.parse(localStorage.getItem("items")) || [];

  const treeContainer = document.getElementById("tree");

  treeContainer.innerHTML = "";

  function createTreeItem(item) {
    const listItem = document.createElement("li");
    listItem.textContent = item.name;

    const deleteButton = addDeleteButton(item);
    listItem.appendChild(deleteButton);

    const childItems = items.filter((child) => child.parentId === item.id);

    if (childItems.length > 0) {
      const sublist = document.createElement("ul");
      childItems.forEach((child) => {
        const childListItem = createTreeItem(child);
        sublist.appendChild(childListItem);
      });
      listItem.appendChild(sublist);
    }

    return listItem;
  }

  items
    .filter((item) => !item.parentId)
    .forEach((rootItem) => {
      const treeItem = createTreeItem(rootItem);
      treeContainer.appendChild(treeItem);
    });

  updateParentSelect();
}

// function updateItem(itemId, newItemName) {}

function deleteItem(itemId) {
  const items = JSON.parse(localStorage.getItem("items")) || [];

  const indexToDelete = items.findIndex((item) => item.id === itemId);

  if (indexToDelete === -1) {
    console.log("Item não encontrado");
    return;
  }

  items.splice(indexToDelete, 1);

  localStorage.setItem("items", JSON.stringify(items));

  readTree();
}

document.getElementById("addItemForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const itemName = document.getElementById("itemName").value;
  const parentItem = document.getElementById("parentItem").value;

  const itemNameInput = document.getElementById("itemName");

  itemNameInput.value = "";

  createItem(itemName, parentItem);
});

window.addEventListener("load", function () {
  readTree();
});
