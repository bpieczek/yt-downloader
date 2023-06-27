<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      url: "",
      format: "mp4",
    };
  },
  methods: {
    async download(event) {
      try {
        event.preventDefault();
        this.$refs.error.innerHTML = "";
        const data = await axios.get(
          `https://backend-yt-downloader.onrender.com?url=${this.url}&format=${this.format}`,
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([data.data], {
          type: data.headers["Content-Type"],
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `video.${this.format}`;
        link.click();
        URL.revokeObjectURL(link.href);
      } catch (err) {
        this.$refs.error.innerHTML = "Something's went wrong try again";
      }
    },
  },
};
</script>

<template>
  <form v-on:submit="download" action="">
    <div>
      <input
        type="text"
        name="url"
        v-model="url"
        placeholder="Your link here"
      />
      <label>
        Convert to
        <select v-model="format">
          <option>mp4</option>
          <option>mp3</option>
        </select>
      </label>
    </div>
    <input type="submit" value="Download" />
  </form>

  <div id="error">
    <p ref="error"></p>
  </div>
</template>

<style scoped lang="scss">
form {
  text-align: center;
  font-size: 2rem;

  * {
    border: none;
  }

  > div {
    margin-bottom: 1em;
    border-radius: 1em;

    display: flex;
    flex-direction: column;
    gap: 0.5em;

    > * {
      height: 100%;
      background-color: rgb(0 0 0 / 0.6);

      transition: filter 250ms ease-in-out;

      border-radius: inherit;
    }
    span {
      display: inline-block;
    }
  }
  input[type="text"] {
    padding-inline: 0.4em;

    filter: brightness(0.7);
    &:focus {
      filter: brightness(1);
    }

    &::placeholder {
      color: rgb(255 255 255 / 0.8);
    }
  }

  label {
    margin-inline: auto;
    padding-inline: 0.4em;
    filter: brightness(0.7);

    &:focus-within {
      outline: 2px solid white;
      filter: brightness(1);
    }
  }

  select {
    // border-left: 1px solid grey;
    background-color: transparent;
    text-decoration: underline;
    cursor: pointer;

    option {
      background-color: var(--bg-prim);
    }

    &:focus {
      outline: none;
    }
  }

  input[type="submit"] {
    cursor: pointer;
    background-color: #171717;
    border-radius: 0.35em;
    padding: 0.05em 0.35em;
  }
}
#error {
  position: absolute;
  top: -3em;
  width: 100%;

  p {
    font-size: 1.2rem;

    padding-inline: 1em;
    text-align: center;
    color: var(--text-c-error, red);
    background-color: rgb(0 0 0 / 0.6);
    border-radius: 1em;
    margin-inline: auto;
    width: fit-content;
  }
}

#error,
label {
  user-select: none;
}
</style>
