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
            label.style.marginRight = "10px";

            li.append(label);
            const responsibleLabel = document.createElement('label') as HTMLLabelElement;
            responsibleLabel.textContent = "Assigned:";
            responsibleLabel.style.fontSize = "14px";
            responsibleLabel.style.marginLeft = "5px";
            responsibleLabel.style.marginLeft = "5px";
            responsibleLabel.style.marginRight = "20px";
            li.append(responsibleLabel);
            li.append(responsibleText);

            // code for priority
            const prioritySelect = document.createElement('select') as HTMLSelectElement;
            prioritySelect.style.width = '100px'; // set the width of the dropdown
            prioritySelect.style.height = '45px';
            prioritySelect.style.marginLeft = "5px"; // set the height of the dropdown
            const options = ['High', 'Medium', 'Low'];
            options.forEach(option => {
                const optElement = document.createElement('option');
                optElement.value = option;
                optElement.textContent = option;
                if (item.priority === option) {
                    optElement.selected = true;
                }
                prioritySelect.append(optElement);
            });

            prioritySelect.addEventListener('change', () => {
                item.priority = prioritySelect.value;
                fullList.saveList();
            });
            const priorityLabel = document.createElement('label') as HTMLLabelElement;
            priorityLabel.textContent = "Priority:";
            priorityLabel.style.fontSize = "14px";
            priorityLabel.style.marginRight = "5px";
            li.append(priorityLabel);
            li.append(prioritySelect);

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