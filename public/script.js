const logout = document.querySelector('#logout');

logout?.addEventListener('click', () => {
    fetch('http://localhost:3000/logout', {
        method: 'POST'
    }).then(() => {
        location.href='/home';
    });
});

