// Copyright 2026 Camptocamp (http://www.camptocamp.com).
// @author Iván Todorovich <ivan.todorovich@gmail.com>
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

import {ProductPage} from "@website_sale/interactions/product_page";
import {patch} from "@web/core/utils/patch";

patch(ProductPage.prototype, {
  /**
   * Only allow integer quantities for UoMs that are not continuous.
   *
   * @override
   */
  _onChangeCombination(ev, parent, combination) {
    const input = parent.querySelector('input[name="add_qty"]');
    const quantity = parseFloat(input?.value);
    if (input && !combination.uom_is_continuous && !Number.isInteger(quantity)) {
      input.value = Math.max(
        Math.trunc(quantity) || 0,
        parseFloat(input.dataset.min || 1)
      );
    }
    return super._onChangeCombination(...arguments);
  },
});
