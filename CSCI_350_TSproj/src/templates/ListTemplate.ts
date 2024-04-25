import FullList from "../model/FullList";

interface DOMList {
    ul: HTMLUListElement,
    clear(): void,
    render(fullList: FullList): void,
}

export default class ListTemplate implements DOMList{

    ul: HTMLUListElement;

    static instance: ListTemplate = new ListTemplate();

    private constructor(){
        this.ul = document.getElementById("listItems") as HTMLUListElement
    }

    clear(): void {
        this.ul.innerHTML = '';
    }

    render(fullList: FullList): void {
        this.clear();
        fullList.list.forEach(item => {
            const li = document.createElement('li') as HTMLLIElement;
            li.className = "item";
            const check = document.createElement('input') as HTMLInputElement;
            check.type = "checkbox";
            check.id = item.id;
            check.tabIndex = 0;
            check.checked = item.checked;

            // Create a text node for responsible person's name
            const responsibleText = document.createTextNode(item.responsible ? item.responsible : '');

            
            li.append(check);

            check.addEventListener('change', () => {
                if (check.checked) {
                    fullList.removeItem(item.id);
                } else {
                    item.checked = !item.checked;
                    fullList.saveList();
                }
            })

            const label = document.createElement('label') as HTMLLabelElement;
            label.htmlFor = item.id;
            label.textContent = item.item;

            li.append(label);
            li.append(responsibleText);

            const editButton = document.createElement('button') as HTMLButtonElement;
            editButton.className = "edit";
            editButton.textContent = "Edit";
            li.append(editButton);

            editButton.addEventListener('click', () => {
                const input = document.createElement('input') as HTMLInputElement;
                input.placeholder = "Assignee's Name";
                const saveButton = document.createElement('button') as HTMLButtonElement;
                saveButton.textContent = "Save";
                li.append(input);
                li.append(saveButton);

                saveButton.addEventListener('click', () => {
                    item.responsible = input.value;
                    fullList.saveList();
                    input.remove();
                    saveButton.remove();
                    responsibleText.textContent = item.responsible;
                })
            })

            const removeButton = document.createElement('button') as HTMLButtonElement;
            removeButton.className = "remove";
            removeButton.textContent = "X";
            li.append(removeButton);

            removeButton.addEventListener('click', () => {
                // Log the id of the item to be removed
                console.log(`Removing item with id: ${item.id}`);
                fullList.removeItem(item.id);
                // After removing the item, log the remaining items
                console.log(fullList.list);
                this.render(fullList);
            })

            this.ul.append(li);
        });
    }
}