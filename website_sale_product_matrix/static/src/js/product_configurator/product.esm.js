/* Copyright 2026 Tecnativa - Carlos Roca
 * License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl). */

import {Product, productProps} from "@sale/js/product/product";
import {formatCurrency} from "@web/core/currency";
import {patch} from "@web/core/utils/patch";
import {t} from "@odoo/owl";

Object.assign(productProps, {
  is_matrix: t.boolean().optional(),
  matrix_lines: t.array(t.object()).optional(),
});

patch(Product.prototype, {
  /**
   * @returns {Boolean} Whether the variants are chosen through the matrix.
   */
  get isMatrixProduct() {
    return Boolean(this.env.isFrontend && this.isMainProduct && this.props.is_matrix);
  },

  /**
   * The attributes are chosen through the matrix.
   *
   * @override
   */
  shouldShowPtal() {
    return !this.isMatrixProduct && super.shouldShowPtal(...arguments);
  },

  /**
   * @param {Object} line - A variant configured in the matrix.
   * @returns {String} The price of the line.
   */
  getFormattedMatrixLinePrice(line) {
    return formatCurrency(line.unit_price * line.qty, this.env.currencyId);
  },
});
