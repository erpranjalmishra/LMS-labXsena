document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=trending&maxResults=20';
    const booksContainer = document.getElementById('books');
    const cartContainer = document.getElementById('cart');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const cartButton = document.getElementById('cartButton');
    const cartPopup = document.getElementById('cartPopup');
    const closePopup = document.getElementById('closePopup');
    const chatPopup = document.getElementById('chatPopup');
    const closeChatPopup = document.getElementById('closeChatPopup');
    const chatBox = document.getElementById('chatBox');
    const chatInput = document.getElementById('chatInput');
    const sendChatButton = document.getElementById('sendChatButton');
    const helpButton = document.getElementById('helpButton');
    const cartCount = document.getElementById('cartCount');
    const cartButtonHeader = document.getElementById('cartButtonHeader');
    const cartCountHeader = document.getElementById('cartCountHeader');

    let cartItems = [];


    async function fetchBooks(query = 'trending') {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`);
            const data = await response.json();
            displayBooks(data.items);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    function displayBooks(books) {
        booksContainer.innerHTML = '';
        books.forEach(book => {
            const bookInfo = book.volumeInfo;
            const bookElement = document.createElement('div');
            bookElement.classList.add('book');
            bookElement.innerHTML = `
                <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Image'}" alt="${bookInfo.title}">
                <h2>${bookInfo.title}</h2>
                <p>${bookInfo.description ? bookInfo.description.substring(0, 100) + '...' : 'No description available'}</p>
                <a href="${bookInfo.infoLink}" target="_blank">More Info</a>
                <button onclick="addToCart('${bookInfo.title}', '${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Image'}', '${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author'}')">Add to Cart</button>
            `;
            booksContainer.appendChild(bookElement);
        });
    }
    function updateCartCount() {
        const cartCount = cart.length;
        document.getElementById('cartCount').textContent = cartCount;
        cartCountHeader.textContent = cartCount;
    }
    
    cartButtonHeader.addEventListener('click', () => {
        cartPopup.style.display = 'block';
    });
    
    
    updateCartCount();

    window.addToCart = function(title, image, authors) {
        const cartItem = {
            title,
            image,
            authors
        };
        cartItems.push(cartItem);
        updateCartCount();
        displayCartItems();
    }

    window.removeFromCart = function(index) {
        cartItems.splice(index, 1);
        updateCartCount();
        displayCartItems();
    }

    function displayCartItems() {
        cartContainer.innerHTML = '';
        cartItems.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h2>${item.title}</h2>
                <p>${item.authors}</p>
                <button onclick="removeFromCart(${index})">Remove from Cart</button>
            `;
            cartContainer.appendChild(cartItemElement);
        });
    }

    function updateCartCount() {
        cartCount.textContent = cartItems.length;
    }

    async function sendMessageToGemini(message) {
        const API_KEY = 'AIzaSyCNjlQYV3tOcIc_ijARSin2QQXde6iAakc'; 
        const URL = 'https://gemini.google.com/chat';

        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            return 'Sorry, there was an error communicating with Gemini.';
        }
    }

    async function handleSendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            displayMessage(userMessage, 'user');
            chatInput.value = '';
            const geminiResponse = await sendMessageToGemini(userMessage);
            displayMessage(geminiResponse, 'gemini');
        }
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    searchButton.addEventListener('click', function() {
        const query = searchInput.value;
        fetchBooks(query);
    });

    cartButton.addEventListener('click', function() {
        cartPopup.style.display = 'flex';
    });

    closePopup.addEventListener('click', function() {
        cartPopup.style.display = 'none';
    });

    helpButton.addEventListener('click', function() {
        chatPopup.style.display = 'flex';
    });

    closeChatPopup.addEventListener('click', function() {
        chatPopup.style.display = 'none';
    });

    sendChatButton.addEventListener('click', handleSendMessage);

    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });
    window.addEventListener('click', function(event) {
        if (event.target === cartPopup) {
            cartPopup.style.display = 'none';
        } else if (event.target === chatPopup) {
            chatPopup.style.display = 'none';
        }
    });

    fetchBooks();
});

