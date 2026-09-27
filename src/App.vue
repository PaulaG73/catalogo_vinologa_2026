<template>

    <router-view/>
    
    </template>
    
    <style>
    html {
      scroll-behavior: smooth;
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }

    body {
      margin: 0;
      overflow-x: clip;
      background-color: var(--vin-negro-marca);
      color: var(--vin-texto-claro);
    }

    #app {
      font-family: 'Nunito', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      min-height: 100vh;
      color: var(--vin-texto-claro);
      background-color: var(--vin-negro-marca);
    }
    </style>
    