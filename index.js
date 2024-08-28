const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

morgan.token("person", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person "
  )
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((el) => Number(el.id))) : 0;
  return String(maxId + Math.floor(Math.random() * 1000));
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!request.body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }
  const isDuplicateName = persons.find(
    (person) => person.name === request.body.name
  );

  if (isDuplicateName) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: request.body.name,
    id: generateId(),
    number: request.body.number,
  };
  persons = persons.concat(person);
  response.json(person);
  morgan.token(person, function (req, res) {
    return req.body;
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  const date = new Date();
  const personsAmount = persons.length;
  response.send(
    `<p>Phonebook has info for ${personsAmount} people</p><p> ${date} </p>`
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
