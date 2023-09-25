import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// check locale
let defaultLocale = 'en'
if(navigator.language.includes('ru')) {
    defaultLocale = 'ru'
}

const locales = ['ru', 'en']

if(window.location.pathname === '/') {
    const searchQuery = window.location.search
    window.location.replace(`/${defaultLocale}/${searchQuery}`)
} else {
   const locale = window.location.pathname.replace(/^\/([^\/]+).*/i, '$1');

   if(!locales.includes(locale)) {
       const params = window.location.pathname.split('/')
       const searchQuery = window.location.search
       params[0] = `/${defaultLocale}`;
       const newPath = `${params.join('/')}${searchQuery}`
       window.location.replace(newPath)
   }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
