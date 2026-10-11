import {Interaction} from "@web/public/interaction";
import {registry} from "@web/core/registry";
import {sendRequest} from "@website/interactions/post_link";

export class WebsiteSaleProductMatrix extends Interaction {
  static selector = "#product_detail";
  dynamicContent = {
    ".o_we_order_matrix": {"t-on-click.prevent": this.addToCartFromMatrix},
    "#product_matrix_form a.js_add_cart_json": {
      "t-on-click.prevent": this.onClickQuantityButton,
    },
  };

  /**
   * The quantity buttons of the matrix were handled by the generic
   * `WebsiteSale` interaction, which doesn't exist anymore.
   *
   * @param {MouseEvent} ev
   */
  onClickQuantityButton(ev) {
    const button = ev.currentTarget;
    const input = button.closest(".input-group").querySelector(".o_matrix_input");
    const min = parseFloat(input.dataset.min || 0);
    const quantity =
      (parseInt(input.value, 10) || 0) +
      (button.getAttribute("name") === "remove_one" ? -1 : 1);
    input.value = Math.max(quantity, min);
    input.dispatchEvent(new Event("change", {bubbles: true}));
  }

  /**
   * Overridable method to add stuff to the grid
   * @param {Number} product_template_id
   * @param {HTMLFormElement} form
   * @returns {Object}
   */
  _parseGridChanges(product_template_id, form) {
    const inputs = form.getElementsByClassName("o_matrix_input");
    const changes = Array.from(inputs).map((input) => {
      return {
        qty: parseInt(input.value, 10) || 0,
        ptav_ids: JSON.parse(input.dataset.ptav_ids),
      };
    });
    return {
      product_template_id: product_template_id,
      changes: changes,
    };
  }

  /**
   * Parse the grid with the changes to apply into the order
   * @param {Event} ev
   */
  addToCartFromMatrix(ev) {
    const form = ev.currentTarget.closest("form");
    const params = {
      product_template_id: parseInt(form.dataset.product_template_id, 10),
    };
    const grid = this._parseGridChanges(params.product_template_id, form);
    params.grid = JSON.stringify(grid);
    sendRequest("/shop/cart/update_from_matrix", params);
  }
}

registry
  .category("public.interactions")
  .add(
    "website_sale_product_matrix.website_sale_product_matrix",
    WebsiteSaleProductMatrix
  );
