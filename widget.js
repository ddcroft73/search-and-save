// fix, auto search when user selects an item


class SearchAndSave {
    constructor() {
        // Psuedo Component State
        this.state = {
            menuVisible: false,
            save: false,
            menuItems: [],
            currentItem: null,
        };
        
        // DOM
        this.searchButton = document.querySelector(".button");
        this.textBox = document.querySelector(".text");
        this.expandButton = document.querySelector(".expand");
        this.menu = document.querySelector(".menu");
// cjange the name from save        
        this.saveCheck = document.querySelector("#checkbox");
        this.component = document.querySelector(".component");
        this.clearButton = document.querySelector("#delete");

        this.textBox.addEventListener("click", () => {
            this.viewMenu(false);
        });
        this.expandButton.addEventListener("click", () => {
            this.viewMenu(true);
        });
        this.menu.addEventListener("click", () => {
            this.viewMenu(false);
        });

        this.saveCheck.addEventListener("click", () => {
// change the name to checkbox from save            
            let checked = document.getElementById("checkbox").checked;
            if (checked) this.state.save = true;
            else this.state.save = false;
        });

        // show the clear button when needed
        this.textBox.addEventListener("keydown", (e) => {
            if (this.textBox.value.length >= 3) {
              //  this.showClearButton(true);
            } else if (this.textBox.value.length <= 1) {
              //  this.showClearButton(false);
            }            
            console.log(e);
            if (e.key === "ArrowDown") {
                this.viewMenu(true);
            }
            if (e.key === "Enter") {
                if (this.textBox.value !== "") {
                    const click = new Event("click");
                    this.searchButton.dispatchEvent(click);
                }
            }
        });

        this.searchButton.addEventListener("click", () => {
            const newItem = this.textBox.value;
            this.viewMenu(false);

            if (newItem !== "") {
                // are we saving this?
                if (this.state.save) {
                    // Check to see if this item already exists...
                    // if it does exist, dont save again.
                    const exists = this.itemExists(newItem);
                    if (!exists) {
                        // add the input to the menuItems array.
                        const itemObj = this.addNewItem(newItem);
                        this.addToMenu(itemObj, itemObj.itemID); // add the item to the menu.
                    }
                }

                // Turn over the location to be searched...
                this.state.currentItem = newItem;
            } else {
                alert("Enter a location to search.");
            }
        });

        this.clearButton.addEventListener("click", () => {
            this.textBox.value = "";
           // this.showClearButton(false);
        });

        // hide menu when clicked outside component
        document.addEventListener("click", (e) => {
            let targetEl = e.target; // clicked element
            do {
                if (targetEl == this.component) {
                    return;
                }
                // Go up the DOM
                targetEl = targetEl.parentNode;
            } while (targetEl);

            this.viewMenu(false);
        });
    }

    // Methods //
    itemExists = (itemText) => {
        for (let i = 0; i < this.state.menuItems.length; i++) {
            if (
                this.state.menuItems[i].text.toLowerCase() ===
                itemText.toLowerCase()
            ) {
                return true;
            }
        }
        return false;
    };

    showClearButton = (show) => {
        return show
            ? (this.clearButton.style = "visibility: visible;")
            : (this.clearButton.style = "visibility: hidden;");
    };

    // show or hide the menu.
    viewMenu = (view) => {
        if (view) {
            this.menu.style = "visibility: visible;";
            this.state.menuVisible = true;
        } else {
            this.menu.style = "visibility: hidden;";
            this.state.menuVisible = false;
        }
    };

    // loop throught the IDS and return the corresponding text
    getItemText = (itemID) => {
        for (let i = 0; this.state.menuItems.length; i++) {
            if (itemID === this.state.menuItems[i].itemID) {
                return this.state.menuItems[i].text;
            }
        }
    };

    // remove this item from the menu and from storage.
    removeItem = (itemID) => {
        const getItemIndex = (array, id) => {
            for (let i = 0; i < array.length; i++) {
                if (array[i].itemID == id) {
                    return i;
                }
            }
            return -1;
        };
        const removeFromDOM = (id) => {
            const menuItems = document.querySelectorAll(".item-container");
            const container = document.querySelector(".menu");
            let thisID = null;

            for (let i = 0; i < menuItems.length; i++) {
                // slice off the id # after "item-"
                thisID = menuItems[i].getAttribute("id").split("-")[2];
                if (thisID == id) {
                    container.removeChild(menuItems[i]);
                }
            }
        };
        const removeFromStorage = (index) => {
            if (index != -1) {
                this.state.menuItems.splice(index, 1);

                localStorage.setItem(
                    "searches",
                    JSON.stringify(this.state.menuItems)
                );
            }
        };

        removeFromDOM(itemID);
        const itemIndex = getItemIndex(this.state.menuItems, itemID);
        removeFromStorage(itemIndex);
    };

    // listen for the clicks on both the item and the delete Icon and
    // handle accordingly
    bindItemToDOM = (itemID) => {
        const item = document.querySelector("#item-" + itemID);
        const deleteItem = document.querySelector("#close-" + itemID);

        item.addEventListener("click", () => {
            console.log(`Item: ${itemID} clicked`);
            this.state.currentItem = this.getItemText(itemID);
            this.textBox.value = this.state.currentItem;
            this.showClearButton(true);

            // conduct a search
        });
        deleteItem.addEventListener("click", () => {
            console.log(`deleteItem: ${itemID} clicked`);

            // remove this menuitem from the menu and from storage.
            this.removeItem(itemID);
        });

        item.addEventListener("mouseover", () => {
            item.style =
                "color: white; background-color: rgba(27, 53, 92, .9);";
            deleteItem.style =
                "color: rgba(232, 10, 10, 0.9);  background-color: rgba(27, 53, 92, .9);";
        });

        item.addEventListener("mouseout", () => {
            item.style =
                "color: black; background-color: rgba(35, 31, 22, .1);";
            deleteItem.style =
                "color: black;  background-color: rgba(35, 31, 22, .1);";
        });

        // Display all previoulsy saved locations
    };

    // add the input to the menu, one item at a time. Decide if using the truncated name
    // or the name as entered.
    addElement = (
        tag,
        parent,
        {
            className = null,
            idName = null,
            src = null,
            width = null,
            content = null,
        } = {}
    ) => {
        const div = document.createElement(tag);
        if (idName != null) div.id = idName;
        if (className != null) div.className = className;
        if (src != null) div.src = src;
        if (width != null) div.width = width;
        if (content != null) div.innerHTML = content;

        parent.appendChild(div);
        return div;
    };

    addToMenu = (inputObj, itemID) => {
        const generateItem = (itemObj, itemID) => {
            // is this name too long to display it all?
            const displayText =
                itemObj.truncatedName === null
                    ? itemObj.text
                    : itemObj.truncatedName;

            // add the item container
            const newItemContainer = this.addElement("div", this.menu, {
                className: "item-container",
                idName: "item-container-" + itemID,
            });
            // add the item
            this.addElement("div", newItemContainer, {
                className: "item",
                idName: "item-" + itemID,
                content: displayText,
            });
            // add the item delete button
            this.addElement("div", newItemContainer, {
                className: "close",
                idName: "close-" + itemID,
                content: "&#x2612;",
            });
        };

        generateItem(inputObj, itemID);
        this.bindItemToDOM(itemID);
    };

    // populate the menu from storage
    loadMenu = (menuItems) => {
        for (let i = 0; i < menuItems.length; i++) {
            console.log(menuItems[i].text);
            this.addToMenu(menuItems[i], menuItems[i].itemID);
        }
        this.textBox.focus();
    };

    // add the item as on object with the ID to find it by, if the location name
    // entered is > 20 chars, then truncate a copy of the name to be used
    // in the menu later
    addNewItem = (itemText) => {
        const getCurrIDS = () => {
            // gets all the IDs from the items in storage
            let returnArray = [];
            for (let i = 0; i < this.state.menuItems.length; i++) {
                returnArray.push(this.state.menuItems[i].itemID);
            }
            return returnArray;
        };

        const getUniqueID = (knownIDs) => {
            let idExists = true;
            let newID = null;

            while (idExists) {
                newID = Math.floor(Math.random() * 300) + 1;
                // if this id doesnt exist
                if (knownIDs.indexOf(newID) === -1) {
                    idExists = false;
                }
            }
            return newID;
        };

        // returns a shortened name if its longer than maxLength
        const truncName = (text) => {
            const maxLen = 20;
            return text.length > maxLen ? text.slice(0, maxLen) + "..." : null;
        };

        // get all known IDs
        const currIDs = getCurrIDS();
        const newID = getUniqueID(currIDs);

        // prepare the data to be saved
        let itemObj = {
            text: itemText,
            itemID: newID,
            truncatedName: truncName(itemText),
        };
        // get whats already there , if anything and add to it
        this.state.menuItems = localStorage.getItem("searches")
            ? JSON.parse(localStorage.getItem("searches"))
            : [];
        this.state.menuItems.push(itemObj);

        localStorage.setItem("searches", JSON.stringify(this.state.menuItems));

        return itemObj;
    };

    // loads searched objects fron localStorage
    getSearches = () => {
        this.state.menuItems = localStorage.getItem("searches")
            ? JSON.parse(localStorage.getItem("searches"))
            : [];
        this.state.totalItems = this.state.menuItems.length;
        return this.state.menuItems;
    };

    // Draw the elements necessary to create te widget.
    renderWidget = () => {
        const container = document.querySelector(".component-container");        
        const component = this.addElement("div", container, {
            className: "component"
        });
        // textbox
        this.addElement("input", component, {
            className: "text",
            idName: "text"
        });
        // search button
        this.addElement("button", component, {
            className: "button",
            idName: "submit",
            content: '<i class="fa-sharp fa-solid fa-magnifying-glass"></i>'
        });
        // checkbox contaitner and input
        const checkboxContainer = this.addElement('div', component, {
            className: "save"
        });
        this.addElement("checkbox", checkboxContainer, {
            idName: "save"
        });
        // expander icon
        this.addElement("div", component, {
            className: "expand",
            dName: "expand",
            content: '<i class="fa-sharp fa-solid fa-caret-down"></i>'
        });
        // Clear Icon\div
        this.addElement("div", component, {
            className: "clear",
            idName: "clear",
            content: 'X'
        });
        // menu container
        const menuContainer = this.addElement("div", container, {
            className: "menu-container"
        });
        // menu
        this.addElement("div", menuContainer, {
            className: "menu",
            idName: "menu"
        });
    };
}

searchBox = new SearchAndSave();
const locations = searchBox.getSearches();
searchBox.loadMenu(locations);
