async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        console.log(users); // This will show the users fetched from the database
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

fetchUsers();