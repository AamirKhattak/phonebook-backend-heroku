/**
 * example
 * inp:     node mongo.js yourpassword Anna 040-1234556
 * out:     added Anna number 040-1234556 to phonebook
 */
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

try {
  const password = process.argv[2];
  const dbURL = `mongodb+srv://aamirkhattak:${password}@cluster0.22bwu.mongodb.net/phonebook-app?retryWrites=true`;
  mongoose.connect(dbURL);
} catch (err) {
  console.log("error logging in, ", err);
  process.exit(1);
}

const entrySchema = new mongoose.Schema({ name: String, number: String });
const Phonebook = mongoose.model("Persons", entrySchema);
//if name, phonenumber is missing, display complete phonebook
if (process.argv.length < 4) {
  Phonebook.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((result) => {
      console.log(`${result.name} ${result.number}`);
    });
    mongoose.connection.close();
    process.exit(1);
  });
} else {
  const __name = process.argv[3];
  const __number = process.argv[4];

  const entry = new Phonebook({ name: __name, number: __number });

  entry.save().then((result) => {
    console.log(`Added ${result.name} ${result.number} to phonebook.`);
    mongoose.connection.close();
  });
}
