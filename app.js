const PRODUCT_CATALOG = [
  {
    sku: "FL065",
    name: "Flippen Lekka Popcorn Sprinkle - Salt & Vinegar 100ml",
    defaultPack: "12 x 100ml",
    ingredients: "Salt, Acidity Regulator, Spice Extract.",
    allergens: "None",
    dairy: null,
  },
  {
    sku: "FL053",
    name: "Flippen Lekka Popcorn Sprinkle - Sour Cream & Chives 100ml",
    defaultPack: "12 x 100ml",
    ingredients:
      "Salt, Maize Starch, Dextrose, Maltodextrin, Onion Powder, Whey Powder (Milk), Cheese Powder (Milk Solids, Emulsifier [E481], Stabiliser [E331], Potassium Sorbate, Annatto [E160B], Anti-Caking Agent [E551]), MSG (Flavour Enhancer [E621]), Acidity Regulator (E262(ii)), Herbs and Spices, Flavouring (Milk), Flavour Enhancer (E627, E631), Spice Extract.",
    allergens: "Milk",
    dairy: {
      percentByDryWeight: "Whey Powder (Milk): 1.5%, Cheese Powder (Milk Solids): 0.8%",
    },
  },
  {
    sku: "FL035",
    name: "Flippen Lekka Spice - Chutney Sprinkle 200ml",
    defaultPack: "12 x 200ml",
    ingredients:
      "Salt, Sugar, Acidifying Agents (E262), Spices, Flavourants, MSG (E621), Yeast Extract (Wheat), Anti-Caking Agent, Spice Extract.",
    allergens: "Wheat (Gluten)",
    dairy: null,
  },
  {
    sku: "FL008",
    name: "Flippen Lekka Spice - Hot & Spicy 200ml",
    defaultPack: "12 x 200ml",
    ingredients:
      "Salt, Spices & Herbs (Celery, Clove, Coriander, Cumin, Ginger, Onion, Oregano, Parsley, Paprika, Thyme, Cayenne Pepper), Flavouring (Soy), Partially Hydrogenated Vegetable Fat, Monosodium Glutamate (E621), Hydrolyzed Vegetable Protein, Colourant (E150c) (Sulphites), Yeast Extract, Anti-Caking Agent, Acidifiers, Corn Syrup Solids, Flavourant, Antioxidant, Sugar, Acidifying Agents (E262), Cereals (Wheat and Maize), Flavourant (Beef Flavour), Dextrose, Dehydrated Vegetable (Onion), Sodium Sulphites (E221), Spice Extracts (Coriander Oil, Paprika Oil, Vegetable Oil), Potassium Sorbate (E202), Anti-Caking Agent, and Flavour Enhancer (E627).",
    allergens: "Soy, Wheat (Gluten), Sulphites",
    dairy: null,
  },
  {
    sku: "FL002",
    name: "Flippen Lekka Spice - Multi Purpose (Original) 200ml",
    defaultPack: "12 x 200ml",
    ingredients:
      "Salt, Spices & Herbs (Celery, Clove, Coriander, Cumin, Ginger, Onion, Oregano, Parsley, Paprika, Thyme), Flavouring (Soy), Partially Hydrogenated Vegetable Fat, Monosodium Glutamate (E621), Hydrolyzed Vegetable Protein, Colourant (E150c) (Sulphites), Yeast Extract, Anti-Caking Agent, Acidifiers, Corn Syrup Solids, Flavourant, Antioxidant, Sugar, Acidifying Agents (E262), Cereals (Wheat and Maize), Flavourant (Beef Flavour), Dextrose, Dehydrated Vegetable (Onion), Sodium Sulphites (E221), Spice Extracts (Coriander Oil, Paprika Oil, Vegetable Oil), Potassium Sorbate (E202), Anti-Caking Agent, and Flavour Enhancer (E627).",
    allergens: "Soy, Wheat (Gluten), Sulphites",
    dairy: null,
  },
];

const form = document.getElementById("declaration-form");
const skuSelect = document.getElementById("sku-select");
const skuQuantity = document.getElementById("sku-quantity");
const addSkuButton = document.getElementById("add-sku");
const skuList = document.getElementById("sku-list");
const preview = document.getElementById("preview");
const downloadButton = document.getElementById("download");

const selectedSkus = [];
let lastGeneratedHtml = "";

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const buildSkuOptions = () => {
  PRODUCT_CATALOG.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.sku;
    option.textContent = `${item.sku} - ${item.name}`;
    skuSelect.appendChild(option);
  });
};

const renderSkuList = () => {
  skuList.innerHTML = "";

  if (selectedSkus.length === 0) {
    skuList.innerHTML = "<p class=\"form__hint\">No SKUs added yet.</p>";
    return;
  }

  selectedSkus.forEach((item, index) => {
    const pill = document.createElement("div");
    pill.className = "sku-pill";

    const info = document.createElement("div");
    info.className = "sku-pill__info";
    info.innerHTML = `<strong>${item.sku}</strong> ${item.name}<span>${item.pack}</span>`;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn btn--secondary";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      selectedSkus.splice(index, 1);
      renderSkuList();
      updateDairyFieldset();
    });

    pill.appendChild(info);
    pill.appendChild(remove);
    skuList.appendChild(pill);
  });
};

const updateDairyFieldset = () => {
  const dairyFieldset = document.getElementById("dairy-fieldset");
  const hasDairy = selectedSkus.some((item) => item.dairy);
  if (dairyFieldset) {
    dairyFieldset.style.display = hasDairy ? "block" : "none";
  }
};

const addSku = () => {
  const sku = skuSelect.value;
  if (!sku) return;

  const product = PRODUCT_CATALOG.find((item) => item.sku === sku);
  const pack = skuQuantity.value.trim() || product.defaultPack;

  if (selectedSkus.some((item) => item.sku === sku)) {
    alert("This SKU is already selected.");
    return;
  }

  selectedSkus.push({ ...product, pack });
  skuSelect.value = "";
  skuQuantity.value = "";
  renderSkuList();
  updateDairyFieldset();
};

const buildDeclarationHtml = (data) => {
  const hasDairy = selectedSkus.some((item) => item.dairy);
  const dairyHeat = data.dairyHeat?.trim();
  const dairyOrigin = data.dairyOrigin?.trim();

  const skuBlocks = selectedSkus
    .map((item) => {
      const dairyLines = item.dairy
        ? `
          <p><strong>Dairy content (by dry weight):</strong> ${item.dairy.percentByDryWeight}</p>
          <p><strong>Dairy heat treatment:</strong> ${dairyHeat || "Not provided"}</p>
          <p><strong>Dairy country of origin:</strong> ${dairyOrigin || "Not provided"}</p>
        `
        : "";

      return `
        <article class="declaration__sku">
          <h4>${item.sku} - ${item.name}</h4>
          <p><strong>Pack:</strong> ${item.pack}</p>
          <p><strong>Ingredients:</strong> ${item.ingredients}</p>
          <p><strong>Allergen(s) present:</strong> ${item.allergens}</p>
          ${dairyLines}
        </article>
      `;
    })
    .join("");

  const noDairyStatement = hasDairy
    ? "This product contains Dairy as noted and does not contain Egg, Meat or Meat based ingredients."
    : "This product does not contain Dairy, Egg, Meat or Meat based ingredients.";

  return `
    <section class="declaration">
      <div class="declaration__header">
        <div>
          <div class="letterhead">Flippen Lekka Holdings (Pty) Ltd</div>
          <div>7 Papawer Str, Blomtuin, Bellville</div>
          <div>Western Cape, 7530</div>
          <div>South Africa</div>
          <div>Tel: 071 371 0499</div>
        </div>
        <div>
          <div><strong>IOEC REF:</strong> ${data.reference} - ${formatDate(data.shipDate)}</div>
          <div class="page-number">Page 1 of 1</div>
        </div>
      </div>

      <div class="declaration__meta">
        <div><strong>Reference:</strong> ${data.reference}</div>
        <div><strong>Vessel &amp; Voyage:</strong> ${data.vessel}</div>
        <div><strong>Container Number:</strong> ${data.container}</div>
        <div><strong>Seal Number:</strong> ${data.seal}</div>
        ${data.consignee ? `<div><strong>Consignee:</strong> ${data.consignee}</div>` : ""}
      </div>

      <div class="declaration__section">
        <p>
          Please find attached the information you require pertaining to the ingredient list for
          the following Flippen Lekka products shipped under this consignment.
        </p>
      </div>

      ${skuBlocks}

      <div class="declaration__section">
        <h3>Consignment statements</h3>
        <p>This product is commercially prepared.</p>
        <p>This product is shelf stable and fully cooked or heat treated, to render the contents sterile and free of contamination.</p>
        <p>This product is retail packaged, which has not been opened or broken.</p>
        <p>This product is for human consumption.</p>
        <p>${noDairyStatement}</p>
        <p><strong>Packaging medium/specifications:</strong> ${data.packaging}</p>
        <p>
          For spices, the goods are commercially milled or ground to a powder, meal or flakes and
          packaged in bags less than or equal to 25kg.
        </p>
      </div>

      <div class="declaration__footer">
        <p>Kind regards,</p>
        <div class="signature">
          <div class="signature__line"></div>
          <div><strong>${data.signatoryName}</strong></div>
          <div>${data.signatoryTitle}</div>
        </div>
      </div>
    </section>
  `;
};

const buildFileContent = (html) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Manufacturing Declaration</title>
    <style>
      body { font-family: "Times New Roman", serif; color: #111; margin: 40px; }
      .declaration__header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 12px; }
      .letterhead { font-weight: 700; }
      .declaration__meta { margin-top: 16px; display: grid; gap: 8px; }
      .declaration__section { margin-top: 18px; }
      .declaration__sku { margin-top: 16px; }
      .signature__line { border-bottom: 1px solid #111; height: 32px; width: 240px; margin-top: 24px; }
      .page-number { text-align: right; font-size: 0.9rem; color: #444; }
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>`;

addSkuButton.addEventListener("click", addSku);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (selectedSkus.length === 0) {
    alert("Please add at least one SKU.");
    return;
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  lastGeneratedHtml = buildDeclarationHtml(data);
  preview.innerHTML = lastGeneratedHtml;
  downloadButton.disabled = false;
});

downloadButton.addEventListener("click", () => {
  if (!lastGeneratedHtml) return;

  const fullHtml = buildFileContent(lastGeneratedHtml);
  const blob = new Blob([fullHtml], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `IOEC_MNF_${Date.now()}.html`;
  link.click();
  URL.revokeObjectURL(link.href);
});

buildSkuOptions();
renderSkuList();
updateDairyFieldset();
