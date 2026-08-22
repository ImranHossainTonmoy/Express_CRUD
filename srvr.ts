import { log } from 'console';
import 'dotenv/config'
import e from "express"

const app = e();
app.use(e.json());


let todos: {
    id: string;
    title: string;
    completed: boolean;
}[] = [];


app.post("/todos", (req, res) => {
    const { title, completed } = req.body;


    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    const todo = {
        id: crypto.randomUUID(),
        title: title,
        completed: completed ?? false
    };

    todos.push(todo);
    res.status(201).json({ todo });
});


app.get("/todos", (req, res) => {
    res.status(200).json(todos);
});


app.get("/todos/:id", (req, res) => {
    const { id } = req.params;

    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    res.status(200).json({ todo });
});


app.put("/todos/:id", (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    if (title !== undefined && title.trim() === "") {
        return res.status(400).json({
            message: "Title cannot be empty"
        });
    }

    todos = todos.map((todo) => {
        return todo.id === id
            ? {
                  ...todo,
                  title: title ?? todo.title,
                  completed: completed ?? todo.completed
              }
            : todo;
    });

    const updatedTodo = todos.find((todo) => todo.id === id);
    res.status(200).json({ todo: updatedTodo });
});


app.delete("/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    todos = todos.filter((todo) => todo.id !== id);
    res.status(200).json({
        message: "Todo deleted successfully"
    });
});


app.get("/todos/completed", (req, res) => {
    const completedTodos = todos.filter(
        (todo) => todo.completed === true
    );
    res.status(200).json(completedTodos);
});


app.get("/todos/incomplete", (req, res) => {
    const incompleteTodos = todos.filter(
        (todo) => todo.completed === false
    );
    res.status(200).json(incompleteTodos);
});



app.listen(process.env.PORT, ()=> {
    log("Server is running");
});

