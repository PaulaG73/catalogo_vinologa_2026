<template>
  <div class="navBar">
    <nav id="navbar-principal" class="navbar navbar-expand navbar-dark bg-vin-negro border-bottom py-2 py-md-4 nav-vino">
      <div class="container-fluid nav-vino-inner">
        <a class="navbar-brand d-flex align-items-center gap-2" href="#">
          <span class="navbar-brand-text">CATÁLOGO 2026</span>
        </a>
        <div class="navbar-nav-links d-flex justify-content-end">
          <ul class="navbar-nav mb-0 flex-row gap-1 gap-sm-2 gap-lg-4 align-items-center">
            <li class="nav-item">
              <a class="nav-link" href="#packs">Packs</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#contacto">Contacto</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
</script>

<style scoped>
.nav-vino {
  flex-wrap: nowrap;
  border-color: var(--vin-borde-sutil) !important;
  box-shadow: 0 1px 0 0 rgba(109, 44, 53, 0.35);
  padding-top: max(0.5rem, env(safe-area-inset-top, 0px)) !important;
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}

.nav-vino-inner {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.nav-vino .navbar-brand,
.nav-vino .nav-link {
  font-family: 'Nunito', system-ui, sans-serif;
  font-weight: 700;
  color: var(--vin-texto-claro);
}

.nav-vino .navbar-brand:hover,
.nav-vino .navbar-brand:focus {
  color: #fff;
}

.nav-vino .navbar-nav .nav-link {
  position: relative;
  padding-inline: 0.75rem;
  padding-block: 0.4rem;
  border-radius: 0.4rem;
  border: 0;
  background: transparent;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.nav-vino .navbar-nav .nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0.15rem;
  width: 0;
  height: 2px;
  border-radius: 2px;
  background-color: var(--vin-acento, #6d2c35);
  transform: translateX(-50%);
  transition: width 0.28s ease;
}

.nav-vino .navbar-nav .nav-link:hover,
.nav-vino .navbar-nav .nav-link:focus-visible {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-vino .navbar-nav .nav-link:hover::after,
.nav-vino .navbar-nav .nav-link:focus-visible::after {
  width: calc(100% - 1.1rem);
}

@media (prefers-reduced-motion: reduce) {
  .nav-vino .navbar-nav .nav-link {
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  .nav-vino .navbar-nav .nav-link:hover,
  .nav-vino .navbar-nav .nav-link:focus-visible {
    transform: none;
  }

  .nav-vino .navbar-nav .nav-link::after {
    transition: width 0.15s ease;
  }
}

.navbar-nav-links {
  flex: 0 0 auto;
}

.nav-vino .navbar-brand {
  flex: 1 1 auto;
  min-width: 0;
  margin-right: 0;
  font-size: clamp(1.05rem, 3.6vw, 1.85rem);
  font-weight: 800;
  line-height: 1.15;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--vin-texto-claro);
}

.navbar-brand-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 767.98px) {
  .nav-vino .navbar-nav .nav-link {
    padding-inline: 0.4rem;
    padding-block: 0.3rem;
    font-size: 0.88rem;
  }
}

@media (min-width: 992px) {
  .nav-vino .navbar-brand {
    flex: 0 1 auto;
  }

  .navbar-nav-links {
    flex: 1 1 auto;
  }
}
</style>
