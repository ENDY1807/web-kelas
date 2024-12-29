document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const uploadButton = document.getElementById('uploadButton');
    const deleteButton = document.getElementById('deleteButton');
    const gallery = document.getElementById('gallery');

    // Load existing photos from localStorage
    loadPhotos();

    uploadButton.addEventListener('click', () => {
        const file = imageInput.files[0];
        const description = descriptionInput.value;

        if (file && description) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const photoData = {
                    src: e.target.result,
                    description: description,
                    date: new Date().toLocaleString()
                };

                // Cek apakah foto sudah ada
                if (isPhotoExists(photoData.src)) {
                    alert('Foto ini sudah di-upload sebelumnya.');
                } else {
                    savePhoto(photoData);
                    displayPhoto(photoData);
                    imageInput.value = '';
                    descriptionInput.value = '';
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Silakan pilih foto dan masukkan deskripsi.');
        }
    });

    function isPhotoExists(src) {
        const photos = JSON.parse(localStorage.getItem('photos')) || [];
        return photos.some(photo => photo.src === src);
    }

    function savePhoto(photoData) {
        const photos = JSON.parse(localStorage.getItem('photos')) || [];
        photos.push(photoData);
        localStorage.setItem('photos', JSON.stringify(photos));
    }

    function loadPhotos() {
        const photos = JSON.parse(localStorage.getItem('photos')) || [];
        photos.forEach(photo => displayPhoto(photo));
    }

    function displayPhoto(photoData) {
        const photoItem = document.createElement('div');
        photoItem.classList.add('photo-item');

        const img = document.createElement('img');
        img.src = photoData.src;
        photoItem.appendChild(img);

        const textContainer = document.createElement('div');
        textContainer.classList.add('text-container');

        const description = document.createElement('span');
        description.classList.add('description');
        description.textContent = photoData.description;
        textContainer.appendChild(description);

        const date = document.createElement('span');
        date.classList.add('date');
        date.textContent = photoData.date;
        textContainer.appendChild(date);

        photoItem.appendChild(textContainer);
        gallery.appendChild(photoItem);

        // Menambahkan event listener untuk memilih foto saat diklik
        photoItem.addEventListener('click', () => {
            photoItem.classList.toggle('selected'); // Menambahkan atau menghapus kelas 'selected'
        });
    }

    deleteButton.addEventListener('click', deleteSelectedPhotos);

    function deleteSelectedPhotos() {
        const selectedPhotos = document.querySelectorAll('.photo-item.selected');
        const photosToDelete = [];

        selectedPhotos.forEach(photoItem => {
            const img = photoItem.querySelector('img');
            photosToDelete.push(img.src); // Menyimpan src foto yang dipilih
            photoItem.remove(); // Menghapus elemen foto dari tampilan
        });

        if (photosToDelete.length > 0) {
            let photos = JSON.parse(localStorage.getItem('photos')) || [];
            photos = photos.filter(photo => !photosToDelete.includes(photo.src));
            localStorage.setItem('photos', JSON.stringify(photos));
        } else {
            alert('Silakan pilih foto yang ingin dihapus.');
        }
    }
});