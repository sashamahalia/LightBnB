INSERT INTO users (name, email, password)
VALUES ('Eva Stanley', 'sebastianguerra@ymail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Lousia Meyer', 'jacksonrose@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Sharky Boolean', 'sharklyfe@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedroorms, country, street, city, province, post_code, active)
VALUES (1, 'Speed lamp', 'description', 'www.example.com', 'www.example.com', 93061, 6, 4, 8, 'Nicaragua', '536 Namsub Highway', 'Granada', 'Masaya', 'V8K334', true),
(3, 'Habit Mix', 'description', 'www.example.com', 'www.example.com', 48000, 5, 0, 1, 'Colomobia', '123 Colores St', 'Bogota', 'El Jabon', 'VNN311', true),
(1, 'Pepper Roni', 'description', 'www.example.com', 'www.example.com', 100000, 6, 4, 8, 'Italy', '423 Gradienta St', 'Rome', 'Pizzaland', 'V8K734', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 2, 3),
('2019-01-04', '2019-08-27', 2, 2),
('2020-02-02', '2020-02-10', 1, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 3, 'message'),
(1, 2, 3, 5, 'message'),
(3, 3, 3, 4, 'message');