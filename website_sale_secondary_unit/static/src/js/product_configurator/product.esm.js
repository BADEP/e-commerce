/* Copyright 2025 Tecnativa - Carlos Roca
 * License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl). */

import {Product, productProps} from "@sale/js/product/product";
import {patch} from "@web/core/utils/patch";
import {t} from "@odoo/owl";

Object.assign(productProps, {
  allow_uom_sell: t.boolean().optional(),
  default_secondary_uom_id: t.or([t.number(), t.literal(false)]).optional(),
  secondary_uom_id: t.number().optional(),
  secondary_uoms: t.array().optional(),
});

patch(Product.prototype, {
  /**
   * Only the main product can be configured, so the optional ones are always
   * added to the cart in their own unit of measure.
   *
   * @returns {Boolean} Whether the customer can choose a secondary unit.
   */
  get hasSecondaryUoms() {
    return this.isMainProduct && Boolean(this.props.secondary_uoms?.length);
  },

  /**
   * @param {Event} event
   */
  selectSecondaryUoM(event) {
    this.env.setSecondaryUoM(
      this.props.product_tmpl_id,
      parseInt(event.target.value, 10)
    );
  },
});
