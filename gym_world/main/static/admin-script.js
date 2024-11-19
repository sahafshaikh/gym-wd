// Copy all the JavaScript from the script tag in the original admin HTML file
// Mock data
const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" }
];

const plans = [
    { id: 1, name: "Basic", price: 29.99, description: "Perfect for beginners", features: ["Access to gym equipment", "Locker room access"] },
    { id: 2, name: "Premium", price: 49.99, description: "For dedicated enthusiasts", features: ["All Basic features", "Personal trainer sessions"] }
];

const products = [
    { id: 1, name: "Protein Powder", price: 29.99, description: "High-quality whey protein" },
    { id: 2, name: "Resistance Bands", price: 19.99, description: "Set of 5 resistance bands" }
];

const orders = [
    { id: 1, user: "John Doe", total: 49.98, status: "Completed" },
    { id: 2, user: "Jane Smith", total: 29.99, status: "Processing" }
];

const services = [
    { id: 1, name: "Personal Training", description: "One-on-one training sessions" },
    { id: 2, name: "Nutrition Consultation", description: "Personalized meal planning" }
];

const bills = [
    { id: 1, user: "John Doe", amount: 49.98, date: "2023-11-15" },
    { id: 2, user: "Jane Smith", amount: 29.99, date: "2023-11-16" }
];

// Function to show selected section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Function to populate tables
function populateTable(tableId, data, fields) {
    const table = document.getElementById(tableId);
    // Clear existing rows
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    // Add new rows
    data.forEach(item => {
        const row = table.insertRow();
        fields.forEach(field => {
            const cell = row.insertCell();
            if (Array.isArray(item[field])) {
                cell.textContent = item[field].join(", ");
            } else {
                cell.textContent = item[field];
            }
        });
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = `
            <button class="btn" onclick="editItem('${tableId}', ${item.id})">Edit</button>
            <button class="btn btn-delete" onclick="deleteItem('${tableId}', ${item.id})">Delete</button>
        `;
    });
}

// Function to edit item
function editItem(tableId, id) {
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editForm');
    form.innerHTML = ''; // Clear previous form fields

    let item;
    let fields;

    switch(tableId) {
        case 'userTable':
            item = users.find(user => user.id === id);
            fields = ['name', 'email'];
            break;
        case 'planTable':
            item = plans.find(plan => plan.id === id);
            fields = ['name', 'price', 'description', 'features'];
            break;
        case 'productTable':
            item = products.find(product => product.id === id);
            fields = ['name', 'price', 'description'];
            break;
        case 'orderTable':
            item = orders.find(order => order.id === id);
            fields = ['user', 'total', 'status'];
            break;
        case 'serviceTable':
            item = services.find(service => service.id === id);
            fields = ['name', 'description'];
            break;
        case 'billTable':
            item = bills.find(bill => bill.id === id);
            fields = ['user', 'amount', 'date'];
            break;
    }

    fields.forEach(field => {
        const label = document.createElement('label');
        label.textContent = field.charAt(0).toUpperCase() + field.slice(1) + ':';
        form.appendChild(label);

        if (field === 'features') {
            const textarea = document.createElement('textarea');
            textarea.name = field;
            textarea.value = item[field].join(', ');
            form.appendChild(textarea);
        } else {
            const input = document.createElement('input');
            input.type = field === 'price' || field === 'amount' || field === 'total' ? 'number' : 'text';
            input.name = field;
            input.value = item[field];
            form.appendChild(input);
        }
    });

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Save Changes';
    form.appendChild(submitBtn);

    form.onsubmit = function(e) {
        e.preventDefault();
        // Update the item with new values
        fields.forEach(field => {
            if (field === 'features') {
                item[field] = form.elements[field].value.split(',').map(feature => feature.trim());
            } else {
                item[field] = form.elements[field].value;
            }
        });
        // Re-populate the table
        populateTable(tableId, window[tableId.replace('Table', '')], fields);
        modal.style.display = 'none';
    };

    modal.style.display = 'block';
}

// Function to delete item
function deleteItem(tableId, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        let array;
        let fields;

        switch(tableId) {
            case 'userTable':
                array = users;
                fields = ['id', 'name', 'email'];
                break;
            case 'planTable':
                array = plans;
                fields = ['id', 'name', 'price', 'description', 'features'];
                break;
            case 'productTable':
                array = products;
                fields = ['id', 'name', 'price', 'description'];
                break;
            case 'orderTable':
                array = orders;
                fields = ['id', 'user', 'total', 'status'];
                break;
            case 'serviceTable':
                array = services;
                fields = ['id', 'name', 'description'];
                break;
            case 'billTable':
                array = bills;
                fields = ['id', 'user', 'amount', 'date'];
                break;
        }

        const index = array.findIndex(item => item.id === id);
        if (index !== -1) {
            array.splice(index, 1);
            populateTable(tableId, array, fields);
        }
    }
}

// Close modal when clicking on <span> (x)
document.querySelector('.close').onclick = function() {
    document.getElementById('editModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Initial population of tables
populateTable('userTable', users, ['id', 'name', 'email']);
populateTable('planTable', plans, ['id', 'name', 'price', 'description', 'features']);
populateTable('productTable', products, ['id', 'name', 'price', 'description']);
populateTable('orderTable', orders, ['id', 'user', 'total', 'status']);
populateTable('serviceTable', services, ['id', 'name', 'description']);
populateTable('billTable', bills, ['id', 'user', 'amount', 'date']);

// Show users section by default
showSection('users');
// Replace any hardcoded URLs with Django URL tags, e.g.:
// document.querySelector('a[href="index.html"]').href = "{% url 'home' %}";