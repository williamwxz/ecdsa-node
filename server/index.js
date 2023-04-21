const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0409a99fa3becfd4d9d86118cbe14112df141fa9a1cca064ef33145fd6d871a5b1abcfdae15d3778f6f50bc08de572439e67e31679a57b7558c7311dd2d87259b5": 100,
  "0464c9d3c43fb4f212a117b7ae0c5557ea7f4383b68d3a7162a2a71823bafe6eb3d60550b469296b7aede0b680438f4c003a7863394d20e8d89687fb9a5324a724": 50,
  "04c6179e1ba14609d773830a963bd3297c88bd8a4b340f1370e1f5534ff6b37182d93a0115dc721fd070ffc3de0057ac8fd9290f92fa2280f34b73efba76ab6abc": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
