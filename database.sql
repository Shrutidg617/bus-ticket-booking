create table buses (
    id serial primary key,
    bus_name varchar(100) not null,
    source varchar(100) not null,
    destination varchar(100) not null,
    departure_time time not null,
    arrival_time time not null,
    fare numeric(10,2) not null,
    total_seats int not null
);

create table bookings (
    id serial primary key,
    passenger_name varchar(100) not null,
    bus_id INT references buses(id),
    seat_number int not null,
    booking_date timestamp default current_timestamp
);

insert into buses(bus_name, source, destination, departure_time, arrival_time, fare, total_seats)
values
('Shivneri Express', 'Pune', 'Mumbai', '07:30', '11:30', 500, 40),
('Neeta Travels', 'Pune', 'Mumbai', '10:00', '14:00', 650, 40),
('MSRTC Express', 'Pune', 'Nashik', '08:00', '12:30', 450, 40),
('Volvo Travels', 'Mumbai', 'Pune', '09:00', '13:00', 700, 40);

alter table bookings
add constraint unique_bus_seat
unique (bus_id, seat_number);