import "./md.css";
import Page from "./preview.svelte";

new Page({
  target: document.body,
  props: {
    data: JSON.parse(new URL(location).searchParams.get("json")),
  },
});
