<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/icomoon.css">
        <title>Game Do</title>
        <link rel="icon" href="/favicon.ico"> <!-- 32×32 -->
        <link rel="icon" href="/icon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">  <!-- 180×180 -->
    </head>
    <body >
        <div id="root"></div>
        <div id="modal-root"></div>
        @vite(['resources/scss/app.scss', 'resources/js/index.jsx'])
    </body>
</html>
