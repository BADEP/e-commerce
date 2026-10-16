/* Copyright 2019 Sergio Teruel
 * Copyright 2025 Carlos Lopez - Tecnativa
 * License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl). */

import {AddToCart} from "@website_sale/interactions/add_to_cart";
import {ProductPage} from "@website_sale/interactions/product_page";
import {patch} from "@web/core/utils/patch";

const SECONDARY_UOM_SELECTOR = 'select[name="secondary_uom_id"]';

/**
 * Return the secondary unit currently selected for a product, if any.
 *
 * @param {HTMLElement} el - The product form or its `.js_product` container.
 * @returns {?{id: Number, factor: Number, uomId: Number}}
 */
function getSelectedSecondaryUom(el) {
  const select =
    el.querySelector(SECONDARY_UOM_SELECTOR) ||
    el.closest(".js_product")?.querySelector(SECONDARY_UOM_SELECTOR);
  if (!select) {
    return null;
  }
  const id = parseInt(select.value, 10);
  if (!id) {
    // The product unit of measure is selected.
    return null;
  }
  return {
    id: id,
    factor: parseFloat(select.selectedOptions[0]?.dataset.factor) || 1,
    uomId: parseInt(select.dataset.productUomId, 10),
  };
}

patch(ProductPage.prototype, {
  setup() {
    super.setup(...arguments);
    this.dynamicContent = {
      ...this.dynamicContent,
      [`.js_product ${SECONDARY_UOM_SELECTOR}`]: {
        "t-on-change": this.onChangeAddQuantity,
      },
    };
  },

  /**
   * Prices are always given for the product unit of measure, so the quantity
   * sent to `get_combination_info` has to be converted from the secondary
   * units typed by the customer.
   *
   * @override
   */
  _getOptionalCombinationInfoParams(product) {
    const params = super._getOptionalCombinationInfoParams(...arguments);
    const secondaryUom = getSelectedSecondaryUom(product);
    if (secondaryUom) {
      const quantity =
        parseFloat(product.querySelector('input[name="add_qty"]')?.value) || 1;
      params.add_qty = quantity * secondaryUom.factor;
      params.uom_id = secondaryUom.uomId;
    }
    return params;
  },
});

patch(AddToCart.prototype, {
  /**
   * Add the selected secondary unit to the payload. The quantity is sent as
   * typed by the customer, in secondary units, and converted by the server.
   *
   * @override
   */
  _getOptionalParams(el) {
    const params = super._getOptionalParams(...arguments);
    const secondaryUom = getSelectedSecondaryUom(el);
    if (secondaryUom) {
      params.uomId = secondaryUom.uomId;
      params.secondary_uom_id = secondaryUom.id;
    }
    return params;
  },
});
