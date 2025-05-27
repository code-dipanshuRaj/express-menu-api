import express from 'express';
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // Middleware to parse JSON bodies

let menu = [];
function outer(){
  let counter = 1;
  return () => {
    return counter++;
  }
}
let uniqueID = outer();

// update a given item
app.put('/update/:id', (req, res) => {
  const item = menu.find( itr => itr.id === parseInt(req.params.id) )
  console.log(`id : ${req.params.id} and type : ${typeof req.params.id}`)
  if (!item) return res.status(404).send('Please enter valid ID, item not found for given ID!')
  const {dish , price} = req.body
  item.price = price;
  item.item = dish;
  res.status(200).send(item)
})

// delete a given item
app.delete('/delete/:id', (req, res) => {
  const index = menu.findIndex( itr => itr.id === parseInt(req.params.id) )
  if (index == -1) return res.statusCode(404).send('Please enter valid ID, item not found for given ID!')
  menu.splice(index,1)
  res.status(200).send(menu)
})

// Get the menu item by id
app.get('/search/:id', (req, res) => {
  const item = menu.find( itr => itr.id === parseInt(req.params.id) )
  if(!item) return res.status(404).send('Sorry, item not found in menu!')
  res.status(200).send(item)
})

// List the menu items
app.get('/', (req, res) => {
  res.status(200).send(menu);
});

// Insert into DB 
app.post('/insert', (req, res) => {
  const {item , price} = req.body
  const newItem = {
    id : uniqueID(),
    item,
    price,
  }
  menu.push(newItem)
  res.status(200).send(newItem);
});

// anything comes under 'body' will be captured in req.body
// anything after /user/':id' will be captured in req.params.id

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});