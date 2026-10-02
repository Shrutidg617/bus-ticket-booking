import { useState } from "react";
import "./App.css";

const api_url = import.meta.env.VITE_API_URL;

function App() {
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [buses, setBuses] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [selectedBus, setSelectedBus] = useState(null);

    const [name, setName] = useState("");
    const [seat, setSeat] = useState("");

    const [message, setMessage] = useState("");

    const searchBuses = async () => {

        const response = await fetch(
            `${api_url}/api/buses/search?source=${source}&destination=${destination}`
        );

        const data = await response.json();

        setBuses(data);
    };

    const bookTicket = async () => {

        if (!name || !seat) {
            setMessage("please enter name and seat number");
            return;
        }

        const response = await fetch(
            `${api_url}/api/bookings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    passenger_name: name,
                    bus_id: selectedBus.id,
                    seat_number: Number(seat)
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            setMessage(
                `ticket booked successfully! booking id: ${data.id}`
            );

            setName("");
            setSeat("");
            setSelectedBus(null);

        } else {

            setMessage(data.error);
        }
    };

    const viewBookings = async () => {

        const response = await fetch(
            `${api_url}/api/bookings`
        );

        const data = await response.json();

        setBookings(data);
    };

    const cancelBooking = async (id) => {

        const response = await fetch(
            `${api_url}/api/bookings/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        setMessage(data.message || data.error);

        viewBookings();
    };


    return (
        <div className="container">
            <h1>BUS TICKET BOOKING SYSTEM!!!</h1>
            {/* search buses */}
            <div className="search-box">

                <input
                    placeholder="Source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                />
                <input
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <button onClick={searchBuses}>
                    search buses
                </button>
            </div>
            {/* available buses */}
            <h2>Available Buses</h2>
            {buses.length === 0 && (
                <p>No buses found.</p>
            )}
            {buses.map((bus) => (
                <div className="bus-card" key={bus.id}>
                    <h3>{bus.bus_name}</h3>
                    <p> {bus.source} → {bus.destination} </p>
                    <p> departure: {bus.departure_time} </p>
                    <p> arrival: {bus.arrival_time} </p>
                    <p> fare: ₹{bus.fare} </p>
                    <button onClick={() => setSelectedBus(bus)}> book ticket </button>
                </div>

            ))}
            {/* booking section */}
            {selectedBus && (
                <div className="booking-box">
                    <h2>book ticket</h2>
                    <p> bus: {selectedBus.bus_name} </p>
                    <input
                        placeholder="Passenger Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Seat Number"
                        value={seat}
                        onChange={(e) => setSeat(e.target.value)}
                    />
                    <button onClick={bookTicket}> confirm booking </button>
                </div>
            )}
            {/* view bookings */}

            <button onClick={viewBookings}> view all bookings </button>
            <h2>all bookings</h2>
            {bookings.map((booking) => (
                <div className="bus-card" key={booking.id}>
                    <p>  booking id: {booking.id} </p>
                    <p> passenger: {booking.passenger_name} </p>
                    <p> bus: {booking.bus_name} </p>
                    <p> route: {booking.source} → {booking.destination} </p>
                    <p> seat: {booking.seat_number}</p>
                    <p>fare: ₹{booking.fare}</p>
                    <button onClick={() => cancelBooking(booking.id)}>
                        cancel booking
                    </button>
                </div>
            ))}
            {/* message */}
            {message && (
                <h3>{message}</h3>
            )}
        </div>
    );
}
export default App;