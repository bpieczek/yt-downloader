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
          `http://localhost:5000?url=${this.url}&format=${this.format}`,
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
  <form action="">
    <input type="text" name="url" v-model="url" />
    <select v-model="format">
      <option>mp4</option>
      <option>mp3</option>
    </select>
    <input v-on:click="download" type="submit" value="Download" />
  </form>

  <p ref="error"></p>
</template>

<style scoped></style>
