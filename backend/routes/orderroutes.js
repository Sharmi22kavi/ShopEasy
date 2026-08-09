const express = require("express");
const router = express.Router();
const pool = require("../config/postgres");

// Save Order
router.post("/", async (req, res) => {
  try {

   const { customer, phone, address, userId, items } = req.body;
const result = await pool.query(
  "INSERT INTO orders (name, phone, address, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
  [customer, phone, address, userId]
);

const orderId = result.rows[0].id;

for (const item of items) {

    await pool.query(
        `INSERT INTO order_details
        (order_id, product_name, price, quantity)
        VALUES ($1, $2, $3, $4)`,

        [
            orderId,
            item.name,
            item.price,
            item.quantity || 1
        ]
    );

}


    res.status(201).json({
      message: "Order Saved Successfully",
      order: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message
    });
  }
});

// Get Orders
router.get("/", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM orders ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message
    });
  }
});

router.put("/cancel/:id", async (req, res) => {
  try {

    await pool.query(
      "UPDATE orders SET status = 'Cancelled' WHERE id = $1",
      [req.params.id]
    );

    res.json({
      message: "Order Cancelled Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;