<template>
  <article>
    <h2>Welcome to AllMyWallets!</h2>
    <p class="intro">
      AMW is the first decentralized privacy-focused app to see all your wallets at a glance, and receive push notifications
      whenever your balances change.<br />
      <router-link :to="{ name: 'home-add-wallet' }" class="button">Add a first wallet</router-link>
      <router-link :to="{ name: 'settings' }" class="button">Import configuration</router-link>
    </p>
    <ul class="features">
      <li class="feature">
        <fa-icon icon="money-bill-alt" /><br />
        <strong>All your wallet balances in the same place</strong><br />
        <span class="more">AMW can retrieve your balances from cryptocurrency explorers to exchanges.</span>
      </li>
      <li class="feature">
        <fa-icon icon="lock" /><br />
        <strong>Your cryptocurrencies never at risk</strong><br />
        <span class="more">AMW only uses public keys and read-only API keys to display your balances.</span>
      </li>
      <li class="feature">
        <fa-icon icon="bell" /><br />
        <strong>Be notified when your money is on the move</strong>
        <span class="more">AMW sends push notifications so you can receive notifications on your smartphone without using the app.</span>
      </li>
      <li class="feature">
        <fa-icon icon="key" /><br />
        <strong>Decentralized and privacy-first</strong>
        <span class="more">AMW data is stored in your browser and stays in your browser.</span>
      </li>
    </ul>
    <p class="intro">
      <router-link :to="{ name: 'home-add-wallet' }" class="button">Add a first wallet</router-link><br />
      AMW can be used on any modern devices, including your smartphone using Chrome, Chromium or Brave.
    </p>
  </article>
</template>

<script>
  export default {
    name: 'first-launch'
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  article {
    text-align: center;
    margin: 0 auto;
    padding: 20px 0;
    max-width: 990px;

    .intro {
      display: block;
      max-width: 600px;
      margin: 0 auto;

      .button {
        margin: 20px 0;
      }
    }

    .features {
      margin: 20px 0;
      padding: 0;
      display: flex;
      flex-flow: wrap;

      .feature {
        flex-grow: 1;
        flex-basis: 0;
        list-style-type: none;
        padding: 10px 20px;

        &:not(:last-child) {
          border-right: 1px solid $color-section-notifications;
        }

        .more {
          margin-top: 10px;
          display: inline-block;
          text-align: left;
        }

        svg {
          color: $color-primary;
          font-size: 3rem;
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
