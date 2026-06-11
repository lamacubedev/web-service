import { onRequestGet } from "../functions/share.js";

const response = onRequestGet({
  request: new Request(
    "https://menu-rush.pages.dev/share?lang=fr&country=KR&meal=dinner&dish=%EB%B9%84%EB%B9%94%EB%B0%A5&label=Bibimbap",
  ),
});
const html = await response.text();
const expected = [
  "Qu&#39;est-ce qu&#39;on mange aujourd&#39;hui ? | Menu Roulette Rush",
  "/share-images/share-fr.jpg?v=20260611",
  "Le menu recommandé est Bibimbap.",
  "/?country=KR&amp;meal=dinner&amp;dish=%EB%B9%84%EB%B9%94%EB%B0%A5&amp;lang=fr",
];

for (const value of expected) {
  if (!html.includes(value)) throw new Error(`Missing share metadata: ${value}`);
}
console.log("share metadata ok");
