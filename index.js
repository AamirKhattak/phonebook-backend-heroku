const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Phonebook = require("./models/phonebook");

/**
 * TODO: HEROKU configuration to be check after completion of all the excercise
 * TODO: 3.16 3.16: Phonebook database, step4
 */
const app = express();

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(cors());

// ###########################################################<start> MORGAN
// LOGGING using tiny config, for all methods except POST
app.use(
  morgan("tiny", {
    skip: (req, res) => req.method === "POST",
  })
);

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});
//only to log POST requests
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body",
    {
      skip: (req, res) => req.method !== "POST",
    }
  )
);
// ###########################################################<end> MORGAN
// LOGGING ###########################################################<start>
// API CALLS


app.use(express.static('build'))

const generateId = () => Math.floor(Math.random() * 100000);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  Phonebook.find({}).then((phonebook) => {
    res.send(`Phonebook has info for ${phonebook.length} people <br/><br/> ${new Date()}`);
  });
});

app.get("/api/persons", (req, res) => {
  Phonebook.find({}).then((phonebook) => {
    res.json(phonebook);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Phonebook.findById(id)
    .then((person) => {
      if (person) res.json(person);
      else res.status(404).end();
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Phonebook.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!(body.name && body.number)) {
    return res.status(400).json({ error: "name or number is missing" });
  }
  // else if (phonebook.find((per) => per.name === body.name)) {     return res
  // .status(400)         .json({error: "name already exists in the phonebook"});
  // }

  const newPerson = new Phonebook({ name: body.name, number: body.number });

  newPerson.save().then((savedPerson) => res.json(savedPerson));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  if (!(body.name && body.number)) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const persons = {
    number: body.number,
  };

  Phonebook.findByIdAndUpdate(req.params.id, persons, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
//###########################################################<end> API CALLS

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
