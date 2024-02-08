# Natours

Natours is a web application designed to facilitate nature tours. It allows users to browse available tours, register for tours, make payments using Stripe, and view detailed information about each tour, including a map displaying tour stops and dates.

## Features

- **User Authentication**: Users can register and log in to their accounts to book tours.
- **Tour Booking**: Users can browse available tours and book their desired tours.
- **Payment Integration**: Secure payment processing using Stripe API for tour bookings.
- **Interactive Map**: Each tour has an interactive map displaying tour stops and dates.
- **Tour Retrieval by Distance Range**: user can retrieve tours within a certain distance range from a specified location through APIs
- **Admin Panel**: Admins and tour leaders have access to additional functionalities:
  - **Tour Statistics**: View statistics related to tours, such as booking numbers and revenue.
  - **Tour History**: Access the history of tours for each year.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API
- **Mapping**: Leaflet API
