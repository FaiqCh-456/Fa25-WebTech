// public/js/crud.js
async function deleteCar(id) {
    if(confirm('Are you sure you want to remove this car from the database?')) {
        try {
            const response = await fetch('/api/cars/' + id, {
                method: 'DELETE'
            });
            const result = await response.json();
            
            if(result.success) {
                window.location.reload();
            } else {
                alert('Error deleting car');
            }
        } catch (err) {
            console.error(err);
            alert('Server error');
        }
    }
}