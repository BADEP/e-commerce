/* Copyright 2021 Tecnativa - Carlos Roca
 * License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl). */

import {AddToCart} from "@website_sale/interactions/add_to_cart";
import {Interaction} from "@web/public/interaction";
import {patch} from "@web/core/utils/patch";
import {registry} from "@web/core/registry";

/**
 * Handle the "+" / "-" buttons of the quantity selector of the shop product
 * items (in 19.0 this was done by the generic WebsiteSale interaction).
 */
export class ProductItemQuantity extends Interaction {
  static selector = ".oe_product_cart .o_wsale_product_btn .css_quantity";
  dynamicContent = {
    "a.js_add_cart_json": {"t-on-click.prevent": this.onChangeQuantity},
  };

  onChangeQuantity(ev) {
    const input = this.el.querySelector("input[name='add_qty']");
    const min = parseFloat(input.dataset.min || 0);
    const max = parseFloat(input.dataset.max || Infinity);
    const previousQty = parseFloat(input.value || 0);
    const quantity =
      (ev.currentTarget.getAttribute("name") === "remove_one" ? -1 : 1) + previousQty;
    const newQty = quantity > min ? (quantity < max ? quantity : max) : min;
    if (newQty !== previousQty) {
      input.value = newQty;
      input.dispatchEvent(new Event("change", {bubbles: true}));
    }
  }
}

registry
  .category("public.interactions")
  .add(
    "website_sale_product_item_cart_custom_qty.product_item_quantity",
    ProductItemQuantity
  );

patch(AddToCart.prototype, {
  /**
   * Send the quantity selected in the shop product item.
   * @override
   */
  _getOptionalParams(el) {
    const params = super._getOptionalParams(el);
    const qtyInput = this.el
      .closest(".oe_product_cart")
      ?.querySelector(".o_wsale_product_btn input[name='add_qty']");
    const quantity = parseFloat(qtyInput?.value);
    if (quantity > 0) {
      params.quantity = quantity;
    }
    return params;
  },
});
