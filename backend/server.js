const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("bus ticket api is running");
});

app.get("/api/buses", async (req, res) => {
    try {
        const result = await pool.query("select * from buses order by id");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "database error" });
    }
});

app.get("/api/buses/search", async (req, res) => {
    try {
        const { source, destination } = req.query;

        const result = await pool.query(
            `select * from buses
             where lower(source) = lower($1)
             and lower(destination) = lower($2)`,
            [source, destination]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "database error" });
    }
});

app.post("/api/bookings", async (req, res) => {
    try {
        const { passenger_name, bus_id, seat_number } = req.body;

        const result = await pool.query(
            `insert into bookings
             (passenger_name, bus_id, seat_number)
             values ($1, $2, $3)
             returning *`,
            [passenger_name, bus_id, seat_number]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        if (error.code === "23505") {
            return res.status(409).json({
                error: "this seat is already booked"
            });
        }

        console.error(error);

        res.status(500).json({
            error: "booking failed"
        });
    }
});

app.get("/api/bookings", async (req, res) => {
    try {
        const result = await pool.query(
            `select
                bookings.id,
                bookings.passenger_name,
                bookings.seat_number,
                bookings.booking_date,
                buses.bus_name,
                buses.source,
                buses.destination,
                buses.fare
             from bookings
             join buses on bookings.bus_id = buses.id
             order by bookings.id desc`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "database error" });
    }
});

app.delete("/api/bookings/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "delete from bookings where id = $1 returning *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "booking not found"
            });
        }

        res.json({
            message: "booking cancelled successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "cancellation failed"
        });
    }
});

module.exports = app;