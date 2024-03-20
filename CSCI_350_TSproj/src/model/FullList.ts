import ListItem from "./ListItem";

interface List {
    list: ListItem[],
    loadList(): void,
    saveList(): void,
    clearList(): void,
    addItem(itemObj: ListItem): void,
    removeItem(id: string): void,
}

export default class FullList implements List{
    static instance: FullList = new FullList();

    private constructor(private _list: ListItem[] = []){}

    get list(): ListItem[]{
        return this._list;
    }

    loadList(): void{
        const storedList: string | null = localStorage.getItem('myList');
        if(typeof storedList != "string") return
            
        const parsedList: {_id: string, _item: string, _checked: boolean} [] = JSON.parse(storedList);
        parsedList.forEach(itemObj => {
            const newListItem = new ListItem(itemObj._id, itemObj._item, itemObj._checked)
            FullList.instance.addItem(newListItem)
        })
    }

    saveList(): void{
        localStorage.setItem('myList', JSON.stringify(this._list));
    }

    clearList(): void{
        this._list = [];
        this.saveList();
    }

    addItem(itemObj: ListItem): void{
        this._list.push(itemObj);
        this.saveList();
    }

    removeItem(id: string): void{
        this._list = this._list.filter(item => item.id !== id);
        this.saveList();
    }
}