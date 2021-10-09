import './App.css'
import {useLiveQuery} from 'dexie-react-hooks'
import Dexie from "dexie";

const db = new Dexie('MarketList')

db.version(1).stores(
    {items: '++id,name,price,itemHasBeenPurchased'},
)

const addItemToDb = async event => {
    event.preventDefault()

    const name = document.querySelector('.item-name').value
    const price = Number(document.querySelector('.item-price').value)

    await db.items.add({
        name,
        price,
        itemHasBeenPurchased: false,
    })
}

const removeItemFromDb = async id => {
    await db.items.delete(id)
}

const markAsPurchased = async (id, event) => {
    await db.items.update(id, { itemHasBeenPurchased: event.target.checked })
}

const App = () => {
    const allItems = useLiveQuery(() => db.items.toArray(), [])

    if (!allItems) return null

    const itemData = allItems.map(({ id, name, price, itemHasBeenPurchased }) => (
        <div className="row" key={id}>
            <p className="col s5">
                <label>
                    <input
                        type="checkbox"
                        checked={itemHasBeenPurchased}
                        onChange={event => markAsPurchased(id, event)}
                    />
                    <span className="black-text">{name}</span>
                </label>
            </p>
            <p className="col s5">${price}</p>
            <i onClick={() => removeItemFromDb(id)} className="col s2 material-icons delete-button">
                delete
            </i>
        </div>
    ))

    return (
        <div className="container">
            <h3 className="green-text center-align">Market List App</h3>
            <form className="add-item-form">
                <input className="item-name" type="text" placeholder="Name of item" required/>
                <input className="item-price" type="number" placeholder="Price in USD" required/>
                <button type="submit" className="waves-effect waves-light btn right" onClick={addItemToDb}>Add item</button>
            </form>
            {allItems.length > 0 &&
                <div className="card white darken-1">
                    <div className="card-content">
                        <form action="#">{itemData}</form>
                    </div>
                </div>
            }
        </div>
    );
}

export default App;
