import FormFiller from "./src/server/services/form-filler.service.js";

(async () => {
  const TEST_URL = "https://bulmor-airground.com"; // replace with real site
  const result = await FormFiller.findAndFill(TEST_URL);
  console.log("✅ Final Result:", result);
})();
