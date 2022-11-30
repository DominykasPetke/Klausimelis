<script setup>
function logout() {
  localStorage.removeItem("token");
  window.location = "/";
}
</script>

<template>Logout page {{ logout() }}</template>
