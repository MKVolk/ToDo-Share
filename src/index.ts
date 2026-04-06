import express from 'express'

const app = express();
app.use(express.json());

//list of todo lists
interface TodoListItem {
    id: number;
    task: string;
    completed: boolean;
    created_at: Date;
    updated_at: Date;
    list_id: number;
}

interface TodoList {
  id: number;
  title: string;
  created_at: Date;
  list_items: TodoListItem[];
}

const todoLists: TodoList[] = [];
let listIdCounter = 1;
let itemIdCounter = 1;

app.get('/', (req,res) =>{
    res.end('Root Page');
});

//Endpoints

//Todo Lists
/*GET /todo - Retrieve all todo lists 
    Responses: Code 200 */
app.get('/todo', (req,res) => {
    return res.status(200).json(todoLists);
});

/*POST /todo - Create a new todo list
    Responses: Code 201, Code 400 Title is required*/
app.post('/todo', (req,res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400)
        .json({ status: 400, message: "Title is required" });
    }

    const newList: TodoList = {
        id: listIdCounter++,
        title,
        created_at: new Date(),
        list_items: [],
    };

    todoLists.push(newList);

    return res.status(201).json(newList);
});

/*GET /todo/:list_id - Retrieve a specific todo list
    Responses: Code 200, Code 404 Todo list not found*/
app.get('/todo/:list_id', (req,res) => {
    const list = todoLists.find((l) => l.id === Number(req.params.list_id));

    if (!list) {
        return res.status(404)
            .json({ status: 404, message: "Todo list not found" });
    }

    return res.status(200).json(list);
});

/*PATCH /todo/:list_id - Update a todo list 
    Responses: Code 204, Code 400 Code is required, Code 404 Todo list not found*/
app.patch('/todo/:list_id', (req,res) => {
    const list = todoLists.find((l) => l.id === Number(req.params.list_id));

    if (!list) {
        return res.status(404)
        .json({ status: 404, message: "Todo list not found" });
    }

    const { title } = req.body;

    if (!title) {
        return res.status(400)
        .json({ status: 400, message: "Title is required" });
    }

    list.title = title;
    return res.status(200).json({ status: 200, message: "Patched successfully" });; //No success message is allowed in Code 204, I change to code 200
});

/*DELETE /todo/:list_id - Delete a todo list
    Responses: Code 204 Todo list deleted, Code 404 Todo list not found
*/
app.delete('/todo/:list_id', (req,res) => {
    //res.end('Delete a todo list');
    const index = todoLists.findIndex((l) => l.id === Number(req.params.list_id));

    if (index === -1) {
        return res.status(404)
        .json({ status: 404, message: "Todo list not found" });
    }

    todoLists.splice(index, 1);
    return res.status(200)
        .json({ status: 200, message: "Todo list deleted" }); //Same change to code 200
});

/*Todo List Items
-GET /todo/:list_id/items - Retrieve all items in a list
    Responses: Code 200 List of todo items, Code 404 Todo list not found
-POST /todo/:list_id/item - Create a new item in a list
    Responses: Code 201, Code 400 task is required, Code 404 Todo list not found
-GET /todo/:list_id/item/:itemId - Retrieve a specific item
    Responses: Code 200 Todo list item retrieved, Code 404 Todo list item not found
-PATCH /todo/:list_id/item/:itemId - Update a specific item
    Responses: Code 204 Todo list item updated, Code 400 Bad request, Code 404 Todo list item not found
-DELETE /todo/:list_id/item/:itemId - Delete a specific item
    Responses: Code 204 Todo list item deleted, code 404 Todo list item not found
*/

/*GET /todo/:list_id/items - Retrieve all items in a list
    Responses: Code 200 List of todo items, Code 404 Todo list not found*/
app.get('/todo/:list_id/items', (req,res) => {
    const list = todoLists.find((l) => l.id === Number(req.params.list_id));

    if (!list) {
        return res.status(404)
        .json({ status: 404, message: "Todo list not found" });
    }

    return res.status(200).json(list.list_items);
});

//POST /todo/:list_id/item - Create a new item in a list
app.post('/todo/:list_id/item', (req,res) => {
    //res.end('Create a new item in a list');

    const list = todoLists.find((l) => l.id === Number(req.params.list_id));

    if (!list) {
        return res.status(404)
        .json({ status: 404, message: "Todo list not found" });
    }

    const { task } = req.body;

    if (!task) {
        return res.status(400)
        .json({ status: 400, message: "task is required" });
    }

    const newItem: TodoListItem = {
        id: itemIdCounter++,
        task,
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
        list_id: list.id,
    };

    list.list_items.push(newItem);

    return res.status(201).json(newItem);
});

//GET /todo/:list_id/item/:itemId - Retrieve a specific item
app.get('/todo/:list_id/item/:itemId', (req,res) => {
    //res.end('Retrieve a specific item');
    const list = todoLists.find((l) => l.id === Number(req.params.list_id));

    if (!list) {
      return res.status(404)
        .json({ status: 404, message: "Todo list item not found" });
    }

    const item = list.list_items.find(
      (i) => i.id === Number(req.params.itemId)
    );

    if (!item) {
      return res.status(404)
        .json({ status: 404, message: "Todo list item not found" });
    }

    return res.status(200).json(item);
});

//PATCH /todo/:list_id/item/:itemId - Update a specific item
app.patch('/todo/:list_id/item/:itemId', (req,res) => {
    //res.end('Update a specific item');

    //Todo: Manage List
    const list = todoLists.find((l) => l.id === Number(req.params.list_id));

    if (!list) {
      return res
        .status(404)
        .json({ status: 404, message: "Todo list item not found" });
    }
    //TODO: Manage item
    const item = list.list_items.find((i) => i.id === Number(req.params.itemId));

    if (!item) {
      return res.status(404)
        .json({ status: 404, message: "Todo list item not found" });
    }
    //TODO: handle request
    const { task, completed } = req.body;

    if (task === undefined && completed === undefined) {
      return res.status(400)
        .json({ status: 400, message: "Bad request" });
    }

    if (task !== undefined) item.task = task;
    if (completed !== undefined) item.completed = completed;

    item.updated_at = new Date();

    return res.status(200)
        .json({ status: 200, message: "Todo list item updated" });// Same change from 204 to 200
});

//DELETE /todo/:list_id/item/:itemId - Delete a specific item
app.delete('/todo/:list_id/item/:itemId', (req,res) => {
    //res.end('Delete a specific item');

    const list = todoLists.find((l) => l.id === Number(req.params.list_id));

    if (!list){
        return res.status(404)
            .json({ status: 404, message: "Todo list item not found"});
    }

    //get index
    const index = list.list_items.findIndex((i) => i.id === Number(req.params.itemId));

    if (index === -1){
        return res.status(404)
            .json({ status: 404, message: "Todo item not found" });
    }

    list.list_items.splice(index,1);

    return res.status(200)
        .json({ status: 200, message: "Todo list item deleted" }); // Same change from 204 to 200
});


//App Listen :3
app.listen(3000, () =>{
    console.log('listening port 3000');
});